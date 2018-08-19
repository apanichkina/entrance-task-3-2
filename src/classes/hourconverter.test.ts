import {HourConverter} from './hourconverter';

test('convert', () => {
  const converter = new HourConverter(24);
  expect(converter.convert(1)).toBe(1);
  expect(converter.convert(24)).toBe(0);
  expect(converter.convert(0)).toBe(0);
  expect(converter.convert(25)).toBe(1);
  expect(converter.convert(49)).toBe(1);
});

test('isBetween', () => {
  const converter = new HourConverter(24);
  expect(converter.isBetween(1, 0, 2)).toBe(true);
  expect(converter.isBetween(2, 0, 1)).toBe(false);
  expect(converter.isBetween(1, 0, 1)).toBe(false);
  expect(converter.isBetween(1, 21, 2)).toBe(true);
  expect(converter.isBetween(20, 21, 2)).toBe(false);
});

test('generator', () => {
  const converter = new HourConverter(24);
  const gen = converter.generator(21, 3);

  const result = [];
  for (const hour of gen) {
    result.push(hour);
  }

  expect(result).toEqual([21, 22, 23, 0, 1, 2]);
});
