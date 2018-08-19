import {IDevice} from '../interfaces/input';
import {HourConverter} from './hourconverter';

class State {
  private readonly hours: number[];
  private readonly hourConverter: HourConverter;

  constructor(availablePower: number, converter: HourConverter) {
    this.hourConverter = converter;
    this.hours = [];

    for (let i: number = 0; i < converter.GetMaxHour(); i++) {
      this.hours[i] = availablePower;
    }
  }

  public Copy(): State {
    const s = new State(0, this.hourConverter);
    for (let i: number = 0; i < this.hours.length; i++) {
      s.hours[i] = this.hours[i];
    }
    return s;
  }

  public CanSet(hour: number, device: IDevice): boolean {
    const generator = this.hourConverter.generator(hour, hour + device.duration);
    for (const hour of generator) {
      if (this.hours[hour] < device.power) {
        return false;
      }
    }
    return true;
  }

  private ChangeBetween(hour: number, device: IDevice) {
    const generator = this.hourConverter.generator(hour, hour + device.duration);
    for (const hour of generator) {
      this.hours[hour] -= device.power;
    }
  }

  public GetNewState(hour: number, device: IDevice) {
    const stateCopy: State = this.Copy();
    stateCopy.ChangeBetween(hour, device);
    return stateCopy;
  }
}

export {State};
