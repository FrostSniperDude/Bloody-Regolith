function getRandomItemFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const names = ["Mark", "Evan", "Harvey", "Zach", "Eli", "Weston"];

function getRandomHumanName() {
  return getRandomItemFromList(names);
}

const corporationNames = ["Blue Corp", "Red Corp"];

function getRandomCorporationName() {
  return getRandomItemFromList(corporationNames);
}

const planetNames = ["Alpha", "Beta", "Charile", "Gamma", "Broton"];

function getRandomPlanetName() {
  let planetName = getRandomItemFromList(planetNames);
  planetName = planetName + "-" + String(Math.round(Math.random() * 100));

  return planetName;
}

const cityNames = ["Kansas City", "New York", "Chicago"];

function getRandomCityName() {
  return  "New "+getRandomItemFromList(cityNames);
}

export { getRandomHumanName, getRandomCorporationName, getRandomPlanetName, getRandomCityName };
