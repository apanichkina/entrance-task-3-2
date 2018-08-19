class HourConverter {
  private readonly maxHour: number;

  constructor(hours: number) {
    this.maxHour = hours;
  }

  public convert(hour: number): number {
    return hour % this.maxHour;
  }

  public isBetween(hour: number, from: number, to: number): boolean {
    hour = this.convert(hour);
    if (to < from) {
      to = this.convert(to) + this.maxHour;
    }

    return (from <= hour && hour < to) ||
      (from <= hour + this.maxHour && hour + this.maxHour < to);
  }

  public GetMaxHour(): number {
    return this.maxHour;
  }

  public *generator(from: number, to: number) {
    if (to < from) {
      to += this.maxHour;
    }
    for (let i: number = from; i < to; i++) {
      yield this.convert(i);
    }
  }
}

export {HourConverter};
