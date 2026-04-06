import { getRandomCityName } from "../../generator.js";

class City {
  constructor(x, y, faction) {
    this.x = x;
    this.y = y;
    this.population = 5;
    this.name = getRandomCityName();
    this.faction = faction;
    this.soldiers = 0;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getPopulation() {
    return this.population;
  }

  getName() {
    return "city";
  }

  getCityName() {
    return this.name;
  }

  getFaction() {
    return this.faction;
  }

  setFaction(faction) {
    this.faction = faction;
  }

  getSoldiers() {
    return this.soldiers;
  }

  changeSoldiers(amount) {
    this.soldiers += amount;
  }

  update() {}
}

export { City };
