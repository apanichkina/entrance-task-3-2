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
  private readonly hoursPeriod: number;
  private devices: Device[];
  private hourRates: Map<number, number>;

  constructor(hours?: number) {
    this.hoursPeriod = hours || 24;
    this.converter = new HourConverter(this.hoursPeriod);
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
      this.devices.push(new Device(device, this.hoursPeriod, this.hourRates, this.converter));
    }

    const result = this.GetBestResult(
      new State(this.hoursPeriod, this.data.maxPower, this.converter),
      this.devices,
    );
    if (result === undefined) {
      throw Error('no best result');
    }

    console.log(result);

    return {
      schedule: new Map(),
      consumedEnergy: {
        value: result.value,
        devices: new Map(),
      },
    };
  }
}

export {modes, LogicManager};
