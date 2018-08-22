import {LogicManager} from './logic';

test('evaluate_common', () => {
  const manager = new LogicManager(3);

  const rates = [
    {from: 0, to: 1, value: 1},
    {from: 1, to: 2, value: 3},
    {from: 2, to: 3, value: 2},
  ];

  expect(manager.Evaluate(
    {
      devices: [
        {id: '', name: '', mode: '', power: 100, duration: 1},
        {id: '', name: '', mode: '', power: 90, duration: 1},
        {id: '', name: '', mode: '', power: 10, duration: 2},
      ],
      maxPower: 100,
      rates,
    },
  ).consumedEnergy.value).toBe(0.33);

  expect(manager.Evaluate(
    {
      devices: [
        {id: '', name: '', mode: '', power: 100, duration: 1},
        {id: '', name: '', mode: '', power: 90, duration: 1},
        {id: '', name: '', mode: '', power: 10, duration: 2},
      ],
      maxPower: 1000,
      rates,
    },
  ).consumedEnergy.value).toBe(0.22);

  expect(manager.Evaluate(
    {
      devices: [
        {id: '', name: '', mode: '', power: 95, duration: 1},
        {id: '', name: '', mode: '', power: 90, duration: 1},
        {id: '', name: '', mode: '', power: 10, duration: 2},
      ],
      maxPower: 100,
      rates,
    },
  ).consumedEnergy.value).toBe(0.320);
});
