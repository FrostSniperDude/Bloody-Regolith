import { executeAction } from "../actionExecutor.js";

const timeBeforeTruck = 10;

class Factory {
  constructor(x, y, faction, resourceType) {
    this.x = x;
    this.y = y;
    this.faction = faction;
    this.timeSinceLastTruck = 0;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getName() {
    return "factory";
  }
  
  setFaction(faction) {
    this.faction = faction;
  }

  getFaction() {
    return this.faction;
  }

  update() {
    this.timeSinceLastTruck += 1;

    if (this.timeSinceLastTruck > timeBeforeTruck) {
      this.timeSinceLastTruck = 0;
      executeAction("Make Truck", this);
    }
  }
}

export { Factory };
