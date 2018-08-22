import {IOutput} from '../interfaces/output';
import {IInput, IRate} from '../interfaces/input';
import {HourConverter} from './hourconverter';
import {State} from './state';
import {Device} from './device';

const modes: Map<string, IHourPeriod> = new Map();
modes.set('night', {from: 21, to: 7});
modes.set('day', {from: 7, to: 21});

class LogicManager {
  private data: IInput;
  private readonly converter: HourConverter;
  private devices: Device[];
  private hourRates: Map<number, number>;

  constructor(hours?: number) {
    this.converter = new HourConverter(hours || 24);
  }

  private GetBestResult(s: State, devices: Device[]): ILocalResult {
    if (devices.length === 0) {
      return {value: 0, path: []};
    }

    const d = devices[0];
    let ok = false;

    let bestHour = 0;
    let bestResult: ILocalResult;

    const gen = d.generator();
    for (const deviceHourResult of gen) {
      if (s.CanSet(deviceHourResult.hour, d.getDeviceInfo())) {
        const newState = s.GetNewState(deviceHourResult.hour, d.getDeviceInfo());

        const result = this.GetBestResult(newState, devices.slice(1));
        if (result === undefined) {
          continue;
        }

        result.value += deviceHourResult.result;

        if (!ok || result.value < bestResult.value) {
          bestResult = result;
          bestHour = deviceHourResult.hour;
        }

        ok = true;
      }
    }

    if (ok) {
      bestResult.path = [bestHour].concat(bestResult.path);
      return bestResult;
    }
  }

  private initHourRates(rates: IRate[]) {
    this.hourRates = new Map();
    for (const rate of rates) {
      const gen = this.converter.generator(rate.from, rate.to);
      for (const hour of gen) {
        if (this.hourRates.has(hour)) {
          throw Error('rates duplication');
        }

        this.hourRates.set(hour, rate.value);
      }
    }
  }

  public Evaluate(data: IInput): IOutput {
    this.data = data;
    this.initHourRates(this.data.rates);

    this.devices = [];
    for (const device of data.devices) {
      this.devices.push(new Device(device, this.hourRates, this.converter));
    }

    const result = this.GetBestResult(
      new State(this.data.maxPower, this.converter),
      this.devices,
    );
    if (result === undefined) {
      throw Error('no best result');
    }

    const output = {
      schedule: Object.create(null),
      consumedEnergy: {
        value: round(result.value),
        devices: Object.create(null),
      },
    };

    for (let i: number = 0; i < result.path.length; i++) {
      const hour = result.path[i];
      const device = this.devices[i].getDeviceInfo();
      const gen = this.converter.generator(hour, hour + device.duration);

      let deviceresult = 0;

      for (const workHour of gen) {
        const schedule = output.schedule[(workHour)] || [];
        schedule.push(device.id);
        output.schedule[workHour] = schedule;

        deviceresult += this.hourRates.get(workHour) * device.power / 1000;
      }

      output.consumedEnergy.devices[device.id] = round(deviceresult); // 4 nums after comma
    }

    return output;
  }
}

function round(input: number): number {
  return Math.round(input * 10000) / 10000;
}

export {modes, LogicManager};
