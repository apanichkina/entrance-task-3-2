interface IDevice {
  id: string;
  name: string;
  power: number;
  duration: number;
  mode: string;
}

interface IRate {
  from: number;
  to: number;
  value: number;
}

interface IInput {
  devices: IDevice[];
  rates: IRate[];
  maxPower: number;
}

export {IInput, IDevice, IRate};
