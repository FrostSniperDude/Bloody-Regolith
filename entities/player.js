import {
  upPressed,
  rightPressed,
  downPressed,
  leftPressed,
} from "../keyHandler.js";
import { canMoveTo, move } from "../main.js";
import { moveTo } from "../ai.js";

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.soldiers = 0;
    this.fighting = false;
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
    return "playerFaction";
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

  update() {
    let goalX = 0;
    let goalY = 0;
    this.fighting = false;

    if (upPressed) {
      goalY = -1;
    }
    if (downPressed) {
      goalY = 1;
    }
    if (leftPressed) {
      goalX = -1;
    }
    if (rightPressed) {
      goalX = 1;
    }

    if (goalY != 0 || goalX != 0) {
      moveTo(this, this.x + goalX, this.y + goalY);
    }
  }
}

export { Player };
