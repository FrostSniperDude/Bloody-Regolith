import { Colonizer } from "./Bloody-Regolith/entities/colonizer.js";
import { world, structures, terrain } from "./Bloody-Regolith/main.js";
import { getNearest, getDistance } from "./Bloody-Regolith/entities/ai.js";
import { City } from "./Bloody-Regolith/structures/city.js";

class Faction {
  constructor(name, displayName, player, metal, water) {
    this.name = name;
    this.displayName = displayName;
    this.metal = metal;
    this.water = water;
    this.player = player;
    this.metalMines = 0;
    this.waterMines = 0;
    this.cities = 0;
  }

  getName() {
    return this.name;
  }

  getDisplayName() {
    return this.displayName;
  }

  getPlayer() {
    return this.player;
  }
  
  wipePlayer() {
    this.player = null
  }

  getMetal() {
    return this.metal;
  }

  changeMetal(change) {
    this.metal += change;
  }

  getWater() {
    return this.water;
  }

  changeWater(change) {
    this.water += change;
  }

  getMetalMines() {
    return this.metalMines;
  }

  changeMetalMines(change) {
    this.metalMines += change;
  }

  getWaterMines() {
    return this.waterMines;
  }

  changeWaterMines(change) {
    this.waterMines += change;
  }

  getCities() {
    return this.cities;
  }

  changeCities(change) {
    this.cities += change;
  }
}

const factions = [];
const minimumCityDistance = 10;

function wipeFactions() {
  factions.length = 0;
}

function addFaction(name, displayName, player, metal, water) {
  let newFaction = new Faction(name, displayName, player, metal, water);

  factions.push(newFaction);
  return newFaction;
}

function getFaction(name) {
  for (let i = 0; i < factions.length; i++) {
    if (factions[i].getName() == name) {
      return factions[i];
    }
  }
}

function getRandomSpot() {
  let x = Math.floor(Math.random() * 40) - 20;
  let y = Math.floor(Math.random() * 40) - 20;

  return [x, y];
}

function addEnemyFaction(name) {
  let pos = getRandomSpot();
  let key = `${pos[0]},${pos[1]}`;
  let ai = new Colonizer(pos[0], pos[1], name);
  let faction = addFaction(name, "Corporation 1", ai, 5, 5);

  let validPos = false;
  while (validPos == false) {
    let nearestCity = getNearest(ai, "structures", "city")[1];

    let distance = getDistance(nearestCity, ai);

    if (distance > minimumCityDistance) {
      let newCity = new City(pos[0], pos[1], name);
      structures.set(key, newCity);
      world.set(key, ai);
      faction.changeCities(1);
      validPos = true;
    } else {
      pos = getRandomSpot();
      key = `${pos[0]},${pos[1]}`;
      ai.setX(pos[0]);
      ai.setY(pos[1]);
    }
  }

  //console.log(`Generated faction at ${pos[0]},${pos[1]}`);
}

function addEnemyFactions() {
  addEnemyFaction("faction1");

  if (Math.random() > 0) {
    addEnemyFaction("faction2");
  }
}

function hasWon() {
  let hasWon = true
  
  for (let i = 0; i < factions.length; i++) {
    if (factions[i].getName() != "playerFaction" && factions[i].getPlayer() != null) {
     hasWon = false
    }
  }
  
  return hasWon && !hasLost()
}

function hasLost() {
  if (getFaction("playerFaction").getPlayer() == null) {
    return true;
  }
  return false;
}

export { wipeFactions, factions, addFaction, getFaction, addEnemyFactions, hasLost, hasWon};
