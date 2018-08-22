import {LogicManager} from './logic';
import {Error} from 'tslint/lib/error';

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

test('evaluate_day', () => {
  const manager = new LogicManager(24);

  const rates = [
    {from: 21, to: 7, value: 1},
    {from: 7, to: 21, value: 3},
  ];

  expect(manager.Evaluate(
    {
      devices: [
        {id: '', name: '', mode: 'day', power: 1000, duration: 1},
      ],
      maxPower: 1000,
      rates,
    },
  ).consumedEnergy.value).toBe(3); // can't set device on night period
});

test('evaluate_night', () => {
  const manager = new LogicManager(24);

  const rates = [
    {from: 21, to: 7, value: 3},
    {from: 7, to: 21, value: 1},
  ];

  expect(manager.Evaluate(
    {
      devices: [
        {id: '', name: '', mode: 'night', power: 1000, duration: 1},
      ],
      maxPower: 1000,
      rates,
    },
  ).consumedEnergy.value).toBe(3); // can't set device on day period
});

test('evaluate_negative', () => {
  const manager = new LogicManager(24);

  const rates = [
    {from: 0, to: 24, value: 3},
  ];

  expect(() => {
    manager.Evaluate(
      {
        devices: [
          {id: '', name: '', mode: 'night', power: 1000, duration: 1},
        ],
        maxPower: 900,
        rates,
      },
    );
  }).toThrow(Error); // no best result
});
