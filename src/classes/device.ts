import {IDevice} from '../interfaces/input';
import {HourConverter} from './hourconverter';
import {modes} from './logic';

class Device {
  private readonly device: IDevice;
  private readonly hoursCanWork: IDeviceHourResult[];

  constructor(device: IDevice, maxHour: number, hourRates: Map<number, number>, converter: HourConverter) {
    this.device = device;
    this.hoursCanWork = [];

    const modeName = device.mode || '';
    let mode: IHourPeriod;
    if (modeName === '') {
      mode = {from: 0, to: maxHour};
    } else {
      mode = modes.get(modeName);
    }
    if (!modes.has(device.mode) && device.mode) {
      throw Error('unexpected mode');
    }

    const modegen = converter.generator(mode.from, mode.to);
    for (const startHour of modegen) {
      let hourResult = 0;
      let isGoodPeriod = true;

      const devicegen = converter.generator(startHour, startHour + device.duration);
      for (const hour of devicegen) {
        if (!converter.isBetween(hour, mode.from, mode.to)) {
          isGoodPeriod = false;
          break;
        }
        hourResult += device.power * hourRates.get(hour) / 1000;
      }

      if (isGoodPeriod) {
        this.hoursCanWork.push({hour: startHour, result: hourResult});
      }
    }
  }

  public* generator() {
    for (const i of this.hoursCanWork) {
      yield i;
    }
  }

  public getDeviceInfo(): IDevice {
    return this.device;
  }
}

export {Device};
