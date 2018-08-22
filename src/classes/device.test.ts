import {Device} from './device';
import {HourConverter} from './hourconverter';

test('generator_common', () => {
  const converter = new HourConverter(3);
  const hourRates = new Map();

  hourRates.set(0, 1);
  hourRates.set(1, 2);
  hourRates.set(2, 3);

  for (const testcase of [
    {duration: 1, result: [{hour: 0, result: 1}, {hour: 1, result: 2}, {hour: 2, result: 3}]},
    {duration: 2, result: [{hour: 0, result: 3}, {hour: 1, result: 5}, {hour: 2, result: 4}]},
    {duration: 3, result: [{hour: 0, result: 6}, {hour: 1, result: 6}, {hour: 2, result: 6}]},
  ]) {
    const device = new Device({
      id: '1',
      name: 'test1',
      power: 1000,
      duration: testcase.duration,
      mode: '',
    }, hourRates, converter);

    const gen = device.generator();

    const result = [];
    for (const hour of gen) {
      result.push(hour);
    }

    expect(result).toEqual(testcase.result);
  }
});

test('generator_modes', () => {
  const hours = 24;
  const converter = new HourConverter(24);
  const hourRates = new Map();

  for (let i: number = 0; i < hours; i++) {
    hourRates.set(i, i + 1);
  }

  for (const testcase of [
    {
      mode: 'night', result: [
        {hour: 21, result: 22}, {hour: 22, result: 23}, {hour: 23, result: 24},
        {hour: 0, result: 1}, {hour: 1, result: 2}, {hour: 2, result: 3}, {hour: 3, result: 4},
        {hour: 4, result: 5}, {hour: 5, result: 6}, {hour: 6, result: 7},
      ],
    },
    {
      mode: 'day', result: [
        {hour: 7, result: 8}, {hour: 8, result: 9}, {hour: 9, result: 10},
        {hour: 10, result: 11}, {hour: 11, result: 12}, {hour: 12, result: 13}, {hour: 13, result: 14},
        {hour: 14, result: 15}, {hour: 15, result: 16}, {hour: 16, result: 17},
        {hour: 17, result: 18}, {hour: 18, result: 19}, {hour: 19, result: 20}, {hour: 20, result: 21},
      ],
    },
  ]) {
    const device = new Device({
      id: '1',
      name: 'test1',
      power: 1000,
      duration: 1,
      mode: testcase.mode,
    }, hourRates, converter);

    const gen = device.generator();

    const result = [];
    for (const hour of gen) {
      result.push(hour);
    }

    expect(result).toEqual(testcase.result);
  }
});
