interface IEnergy {
  value: number;
  devices: Map<string, number>;
}

interface IOutput {
  schedule: Map<string, string[]>;
  consumedEnergy: IEnergy;
}

export {IOutput};
