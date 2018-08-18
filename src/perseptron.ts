const ANNA = 'anna';

class Home {
  private people: string;

  constructor() {
    this.people = ANNA;
  }

  public setName(name) {
    this.people = name;
  }

  public getName() {
    return this.people;
  }
}

export {Home};
