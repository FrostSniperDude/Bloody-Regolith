import { canMoveTo, move, removeSelfWorld } from "../../main.js";
import { getNearest, moveTo } from "./ai.js";
import { getFaction } from "../../factionHandler.js";

class Truck {
  constructor(x, y, faction, resource) {
    this.x = x;
    this.y = y;
    this.faction = faction;
    this.resource = resource;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  getName() {
    return "truck";
  }

  getFaction() {
    return this.faction;
  }

  getResource() {
    return this.resource;
  }

  update() {
    let nearestHomeCity = getNearest(
      this,
      "structures",
      "city",
      this.faction,
      false,
      false
    );

    if (nearestHomeCity) {
      nearestHomeCity = nearestHomeCity[1]
      moveTo(this, nearestHomeCity.getX(), nearestHomeCity.getY());

      if (
        nearestHomeCity.getX() == this.x &&
        nearestHomeCity.getY() == this.y
      ) {
        if (this.resource == "metal") {
          getFaction(this.faction).changeMetal(1);
          removeSelfWorld(this);
        } else if (this.resource == "ice") {
          getFaction(this.faction).changeWater(1);
          removeSelfWorld(this);
        }
      }
    }
  }
}

export { Truck };
