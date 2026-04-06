import { getFaction } from "../../factionHandler.js";
import {
  world,
  terrain,
  cordToNums,
  structures,
  getRandomSpot,
} from "../../main.js";
import { moveTo, getNearest, getDistance } from "./ai.js";
import { executeAction } from "../../actionExecutor.js";

class Colonizer {
  constructor(x, y, faction) {
    this.x = x;
    this.y = y;
    this.soldiers = 0;
    this.faction = faction;
    this.fighting = false;
    this.state = "inital";
    this.goalSoldiers = 0;
    this.lastCords = "";
    this.lastCordTime = 0;
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
    return "player";
  }

  getFaction() {
    return this.faction;
  }

  getSoldiers() {
    return this.soldiers;
  }

  changeSoldiers(amount) {
    this.soldiers += amount;
  }

  getFighting() {
    return this.fighting;
  }

  setFighting(value) {
    this.fighting = value;
  }

  tryToBuildMetalMine() {
    let cords = `${this.x},${this.y}`;
    if (terrain.get(cords) == "metal" && structures.has(cords) == false) {
      executeAction("Build Mine", this);
      return true;
    } else {
      let tile = getNearest(this, "terrain", "metal", null, true);

      if (tile) {
        let cords = cordToNums(tile[0]);

        moveTo(this, cords[0], cords[1]);
        return true;
      } else {
        return false;
      }
    }
  }

  canBuildMetalMine() {
    return getNearest(this, "terrain", "metal", null, true) != null;
  }

  tryToBuildWaterMine() {
    let cords = `${this.x},${this.y}`;
    if (terrain.get(cords) == "ice" && structures.has(cords) == false) {
      executeAction("Build Mine", this);
      return true;
    } else {
      let tile = getNearest(this, "terrain", "ice", null, true);

      if (tile) {
        let cords = cordToNums(tile[0]);

        moveTo(this, cords[0], cords[1]);
        return true;
      } else {
        return false;
      }
    }
  }
  canBuildWaterMine() {
    return getNearest(this, "terrain", "ice", null, true) != null;
  }

  tryToBuildCity() {
    if (!structures.has(`${this.x},${this.y}`)) {
      executeAction("Build City", this);
      return true;
    } else {
      let tile = getNearest(this, "terrain", "ground1", null, true);

      if (tile) {
        let cords = cordToNums(tile[0]);
        moveTo(this, cords[0], cords[1]);
      }
      return false;
    }
  }

  tryToBuildSoldier() {
    let cords = `${this.x},${this.y}`;
    if (
      structures.has(cords) &&
      structures.get(cords).getFaction() == this.faction &&
      structures.get(cords).getName() == "city"
    ) {
      executeAction("Train Soldier", this);

      if (structures.get(cords).getSoldiers() > this.soldiers / 3 + 1) {
        executeAction("Take Soldier", this);
      }
    } else {
      let tile = getNearest(
        this,
        "structures",
        "city",
        this.faction,
        false,
        false
      );

      if (tile) {
        let cords = cordToNums(tile[0]);
        moveTo(this, cords[0], cords[1]);
      }
    }
  }

  collectTruck() {
    let tile = getNearest(this, "world", "truck", this.faction, false);

    if (tile) {
      let cords = cordToNums(tile[0]);
      moveTo(this, cords[0], cords[1]);
    }
  }

  goIntoAttackingState() {
    this.state = "attacking";
    this.goalSoldiers = Math.random() * 1 + 1;
  }

  update() {
    let faction = getFaction(this.faction);
    let metal = faction.getMetal();
    let water = faction.getWater();

    let hasResourcesForMine = metal >= 3 && water >= 1;
    let hasResourcesForCity = metal >= 5 && water >= 5;
    let hasResourcesForSoldier = metal >= 10 && water >= 5;

    let currentMetalMines = faction.getMetalMines();
    let currentWaterMines = faction.getWaterMines();
    let currentCities = faction.getCities();

    let cords = `${this.x},${this.y}`;

    // plan https://docs.google.com/document/d/1RdltuG3malLTexv4TBo5SBCHMJ6zGthru5y_Urjy64Q/edit?usp=sharing
    
    // getting unstuck
    if (this.lastCords == cords) {
      this.lastCordTime += 1
      
      if (this.lastCordtime > 5) {
        moveTo(this, this.x + Math.Floor(Math.random()*2)-1,this.y + Math.Floor(Math.random()*2)-1)
      }
    }
    else {
      this.lastCordTime = 0
    }
    this.lastCords = cords

    if (Math.random() > 0.75) {
      switch (this.state) {
        case "inital":
          if (currentMetalMines < 2) {
            this.tryToBuildMetalMine();
          } else if (currentWaterMines == 0) {
            this.tryToBuildWaterMine();
          } else if (
            (currentWaterMines + currentMetalMines) / 4 >
            currentCities
          ) {
            this.tryToBuildCity();
          } else if (currentMetalMines / 3 < currentWaterMines) {
            this.tryToBuildMetalMine();
          } else if (currentMetalMines / 3 >= currentWaterMines) {
            this.tryToBuildWaterMine();
          }

          if (currentMetalMines + currentWaterMines >= 6) {
            this.state = "building";
            this.goalSoldiers = Math.floor(Math.random() * 3 + 1);
          }

          break;
        case "building":
          if ((currentWaterMines + currentMetalMines) / 4 > currentCities) {
            this.tryToBuildCity();
          } else if (
            currentMetalMines >= this.soldiers ||
            !this.canBuildMetalMine()
          ) {
            if (
              currentWaterMines >= this.soldiers ||
              !this.canBuildWaterMine()
            ) {
              if (hasResourcesForSoldier) {
                this.tryToBuildSoldier();
              } else {
                this.collectTruck();
              }
            } else {
              this.tryToBuildWaterMine();
            }
          } else {
            this.tryToBuildMetalMine();
          }

          if (this.soldiers >= this.goalSoldiers) {
            this.goIntoAttackingState();
          }

          break;
        case "attacking":
          let closestPlayer = getNearest(
            this,
            "world",
            "player",
            this.faction,
            null,
            true
          );
          let closestMine = getNearest(
            this,
            "structures",
            "factory",
            this.faction,
            false,
            true
          );
          let closestCity = getNearest(
            this,
            "structures",
            "city",
            this.faction,
            false,
            true
          );
          let list = [closestPlayer, closestMine, closestCity];

          let closestObject = null;
          let distance = 9999;

          for (let i = 0; i < 3; i++) {
            let current = list[i];

            if (current != null) {
              current = current[1];
              if (closestObject == null) {
                closestObject = current;
                distance = getDistance(closestObject, this);
              } else {
                let currentDistance = getDistance(current, this);

                if (currentDistance < distance) {
                  distance = currentDistance;
                  closestObject = current;
                }
              }
            }
          }

          if (closestObject != null) {
            moveTo(this, closestObject.getX(), closestObject.getY());
          }

          if (this.soldiers == 0) {
            this.state = "building";
          }

          break;
      }
    }
  }
}

export { Colonizer };
