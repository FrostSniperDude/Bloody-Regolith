import { textures } from "./textures.js";
import { inputCommand, inputLine, clearConsole} from "./consoleHandler.js";
import { Player } from "./entities/player.js";
import { City } from "./structures/city.js";
import { reset } from "./keyHandler.js";
import {
  getRandomHumanName,
  getRandomCorporationName,
  getRandomPlanetName,
} from "./generator.js";
import { executeAction } from "./actionExecutor.js";
import {
  wipeFactions,
  addFaction,
  getFaction,
  addEnemyFactions,
  hasLost,
  hasWon,
} from "./factionHandler.js";
import {
  startMusic
} from "./musicHandler.js"

var world = new Map();
var structures = new Map();
var terrain = new Map();
var isPlaying = false;
var player;
const width = 19;
const height = 11;
var corporationName = localStorage.getItem("corporationName");
var playerName = localStorage.getItem("playerName");

const worldWidth = 50;
const worldHeight = 50;

var odd = false;
var resetTimer = 0;
const timeToReset = 21;
var score = 0;

const metalText = document.getElementById("metal");
const waterText = document.getElementById("water");
const soldiersText = document.getElementById("soldiers");
const soldiersCityText = document.getElementById("soldiersCity");

const action1 = document.getElementById("action1");
const action2 = document.getElementById("action2");

const toPlayer = document.getElementById("toPlayer");
const toCity = document.getElementById("toCity");

action1.addEventListener("click", function () {
  runAction(action1.innerHTML.substring(0, action1.innerHTML.indexOf("(") - 1));
  /*console.log(
    action1.innerHTML.substring(0, action1.innerHTML.indexOf("(") - 1)
  );*/
});
action2.addEventListener("click", function () {
  runAction(action2.innerHTML.substring(0, action2.innerHTML.indexOf("(") - 1));
});

toPlayer.addEventListener("click", function () {
  runAction("Take Soldier");
});

toCity.addEventListener("click", function () {
  runAction("Put Soldier");
});

var planetName;

function generateWorld() {
  planetName = getRandomPlanetName();
  for (let x = -worldWidth / 2; x < worldWidth / 2; x++) {
    for (let y = -worldHeight / 2; y < worldHeight / 2; y++) {
      let random = Math.random();
      if (Math.abs(y) / (worldHeight / 2) + random * 0.075 > 0.9) {
        terrain.set(`${x},${y}`, "ice");
      } else if (random > 0.99) {
        terrain.set(`${x},${y}`, "metal");
      } else if (random > 0.7) {
        terrain.set(`${x},${y}`, "ground3");
      } else if (random > 0.5) {
        terrain.set(`${x},${y}`, "ground2");
      } else {
        terrain.set(`${x},${y}`, "ground1");
      }
    }
  }
}

function redraw() {
  var contents = "";

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      let textureTerrain = "empty";
      let textureWorld = "";
      let textureFaction = "";
      let soldiersAmount = "";

      if (isPlaying) {
        let realX = x - (width - 1) / 2 + player.getX();
        let realY = y - Math.round((height - 1) / 2) + player.getY();
        let key = `${realX},${realY}`;

        let hasWorld = world.has(key) && world.get(key) != null;
        let hasStructures = structures.has(key);

        if (
          realX < worldWidth / 2 &&
          realX > -worldWidth / 2 &&
          realY < worldHeight / 2 &&
          realY > -worldHeight / 2
        ) {
          if (
            (hasWorld && !hasStructures) ||
            (hasWorld && hasStructures && !odd)
          ) {
            textureWorld = world.get(key).getName();
            textureFaction = world.get(key).getFaction();

            if (typeof world.get(key).getSoldiers === "function") {
              soldiersAmount = world.get(key).getSoldiers();
            }
          } else if (
            (!hasWorld && hasStructures) ||
            (hasWorld && hasStructures && odd)
          ) {
            textureWorld = structures.get(key).getName();
            textureFaction = structures.get(key).getFaction();

            if (typeof structures.get(key).getSoldiers === "function") {
              soldiersAmount = structures.get(key).getSoldiers();
            }
          }
          textureTerrain = terrain.get(key);
        } else {
          textureTerrain = "empty";
        }
      }

      document.getElementById(`${x},${y},world`).innerHTML =
        textures.get(textureWorld);
      document.getElementById(`${x},${y},terrain`).innerHTML =
        textures.get(textureTerrain);
      document.getElementById(`${x},${y},faction`).innerHTML =
        textures.get(textureFaction);
      document.getElementById(`${x},${y},soldiers`).innerHTML = soldiersAmount;
    }
  }
}

function wipe() {
  clearInterval(mainTick);
  localStorage.removeItem("corporationName");
  localStorage.removeItem("playerName");
  inputLine("Wiped saved data");

  setTimeout(function () {
    location.reload();
  }, 1000);
}

function runAction(name) {
  if (player != null) {
    executeAction(name, player);
  }
}

function cordToNums(cord) {
  let x = Number(cord.substr(0, cord.indexOf(",")));
  let y = Number(cord.substr(cord.indexOf(",") + 1, cord.length - 1));

  return [x, y];
}

function removeSelfWorld(entity) {
  world.delete(`${entity.getX()},${entity.getY()}`);
}

function getRandomSpot(x, y, radius) {
  let randomX = Math.floor(Math.random() * radius) + x - radius / 2;
  let randomY = Math.floor(Math.random() * radius) + y - radius / 2;

  return [randomX, randomY];
}

for (var y = 0; y < height; y++) {
  for (var x = 0; x < width; x++) {
    const square = document.createElement("p");
    square.setAttribute("id", `${x},${y},terrain`);
    square.setAttribute("class", "row");

    let style =
      "position: absolute; left: " + x * 45 + "px; top: " + y * 45 + "px";
    square.setAttribute("style", style);

    document.body.appendChild(square);

    const square2 = square.cloneNode(true);
    square2.setAttribute("id", `${x},${y},world`);
    document.body.appendChild(square2);

    const faction = document.createElement("p");
    faction.setAttribute("id", `${x},${y},faction`);
    faction.setAttribute("class", "faction");
    document.body.appendChild(faction);

    style =
      "position: absolute; left: " +
      (x * 45 + 23) +
      "px; top: " +
      (y * 45 + 10) +
      "px";
    faction.setAttribute("style", style);

    const soldiers = document.createElement("p");
    soldiers.setAttribute("id", `${x},${y},soldiers`);
    soldiers.setAttribute("class", "soldierAmount");
    document.body.appendChild(soldiers);

    style =
      "position: absolute; left: " +
      (x * 45 + 10) +
      "px; top: " +
      (y * 45 + 60) +
      "px";
    soldiers.setAttribute("style", style);
  }
}

const metalStyle =
  "position: absolute; left: " +
  String(screen.width - 450) +
  "px; width:394px; height:20px; top: 433px";
metalText.setAttribute("style", metalStyle);

const waterStyle =
  "position: absolute; left: " +
  String(screen.width - 450) +
  "px; width:394px; height:20px; top: 455px";
waterText.setAttribute("style", waterStyle);

const action1Style =
  "position: absolute; left: " +
  String(screen.width - 325) +
  "px; width:220px; height:20px; top: 450px";
action1.setAttribute("style", action1Style);

const action2Style =
  "position: absolute; left: " +
  String(screen.width - 325) +
  "px; width:220px; height:20px; top: 475px";
action2.setAttribute("style", action2Style);

const soldiersStyle =
  "position: absolute; left: " +
  String(screen.width - 450) +
  "px; width:394px; height:20px; top: 485px";
soldiersText.setAttribute("style", soldiersStyle);

const soldiersCityStyle =
  "position: absolute; left: " +
  String(screen.width - 250) +
  "px; width:120px; height:20px; top: 485px";
soldiersCityText.setAttribute("style", soldiersCityStyle);

const toPlayerStyle =
  "position: absolute; left: " +
  String(screen.width - 325) +
  "px; width:20px; height:20px; top: 500px";
toPlayer.setAttribute("style", toPlayerStyle);

const toCityStyle =
  "position: absolute; left: " +
  String(screen.width - 300) +
  "px; width:20px; height:20px; top: 500px";
toCity.setAttribute("style", toCityStyle);

const tutorialStyle =
  "position: absolute; left: " +
  String(screen.width - 300) +
  "px; width:20px; height:20px; top: 560px";
document.getElementById("tutorial").setAttribute("style", tutorialStyle);

// end of setup

function readyNextGame() {
  clearGame();
  generateWorld();
  inputLine(
    `The captain of the starship approaches you and says, "Hello WIO we're in obrit of ${planetName} the planet has been deemed suitable for colonization by our reconnaissance team. The lander moudles are ready to depart on your orders."`
  );
}

function clearGame() {
  world.clear();
  structures.clear();
  terrain.clear();
}

function startGame() {
  if (isPlaying == false) {
    if (corporationName != null) {
      isPlaying = true;
      wipeFactions();

      let spawnPos = getRandomSpot(0, 0, 40);
      let spawnMessage = "equator";

      if (spawnPos[1] > 0) {
        spawnMessage = "southern hemisphere";
      } else if (spawnPos[1] < 0) {
        spawnMessage = "northern hemisphere";
      }

      inputLine(
        "The lander modules undock from your corporations starship and fire their thrusters to begin the descent. As you dive through the atmosphere the landing thrusters fire at full force, slowing your landing untill it gently touches down. The door hisses open and the construction crew quickly builds a settlement. From the planet's weak magnetosphere you can tell you landed on the " +
          spawnMessage
      );

      player = new Player(spawnPos[0], spawnPos[1]);
      world.set(String(player.getX()) + "," + String(player.getY()), player);

      structures.set(
        `${player.getX()},${player.getY()}`,
        new City(player.getX(), player.getY(), "playerFaction")
      );

      addFaction("playerFaction", corporationName, player, 5, 5);

      addEnemyFactions();
    } else {
      inputLine("Please enter coporation name");
    }
  } else {
    inputLine("Already started");
  }
}

function canMoveTo(x, y) {
  if (
    x < worldWidth / 2 &&
    x > -worldWidth / 2 &&
    y < worldHeight / 2 &&
    y > -worldHeight / 2 &&
    !world.has(`${x},${y}`)
  ) {
    return true;
  }
  return false;
}

function move(entity, x, y) {
  entity = world.get(`${entity.getX()},${entity.getY()}`);
  world.delete(`${entity.getX()},${entity.getY()}`);

  entity.setX(entity.getX() + x);
  entity.setY(entity.getY() + y);

  world.set(`${entity.getX()},${entity.getY()}`, entity);

  if (entity.getName() == "Player") player = entity;
}

function readyCorporation() {
  corporationName = getRandomCorporationName();
  inputLine(
    `The year is just after 2500. With faster than light travel just becoming commercialized mega corporations rush to exploit new planets without regulations. Your name is ${playerName}, and you work for one of these corporations called ${corporationName} as a World Integration Operator. You have one task. Take over the planet by whatever means nessecary. `
  );
}

if (playerName == null) [(playerName = getRandomHumanName())];
console.log(corporationName);
if (corporationName == null) {
  readyCorporation()  
}
readyNextGame()
inputLine("Enter the word 'Launch' to begin colonization");

function countScore() {
  score = 0;
  for (let [key, value] of structures) {
    if (value.getName() == "city" && value.getFaction() == "playerFaction") {
      score++;
    }
  }
}

// main game loop

function tick() {
  if (isPlaying) {
    let x = player.getX();
    let y = player.getY();
    let cords = `${x},${y}`;

    // action1
    if (!structures.has(cords)) {
      action1.innerHTML = "Build City (5 Metal, 5 Water)";
    } else if (
      structures.get(cords).getFaction() == "playerFaction" &&
      structures.get(cords).getName() == "city"
    ) {
      action1.innerHTML = "Train Soldier (10 Metal, 5 Water)";
    } else {
      action1.innerHTML = "";
    }

    //action 2
    if (!structures.has(cords)) {
      if (terrain.get(cords) == "metal" || terrain.get(cords) == "ice") {
        action2.innerHTML = "Build Mine (3 Metal, 1 Water)";
      } else {
        action2.innerHTML = "";
      }
    } else {
      action2.innerHTML = "";
    }

    // ai
    for (let entity of new Map(world)) {
      entity[1].update();
    }

    for (const structure of structures.entries()) {
      structure[1].update();
    }

    metalText.innerHTML = "⚙️ Metal: " + getFaction("playerFaction").getMetal();
    waterText.innerHTML = "💧 Water: " + getFaction("playerFaction").getWater();

    soldiersText.innerHTML = "🥷 Soldiers: " + player.getSoldiers();

    if (structures.has(cords)) {
      if (structures.get(cords).getName() == "city") {
        soldiersCityText.innerHTML =
          "🥷 Garrison: " + structures.get(cords).getSoldiers();
      } else {
        soldiersCityText.innerHTML = "🥷 Garrison: " + 0;
      }
    } else {
      soldiersCityText.innerHTML = "🥷 Garrison: " + 0;
    }

    if ((hasLost() || hasWon()) && resetTimer < 0) {
      resetTimer = timeToReset;

      if (hasWon()) {
        inputLine(
          'Your radio crackles, "Good work WIO im sending a ship down ETA five seconds."'
        );
      } else {
        inputLine(
          "Your coporation quickly notices your vitals stopping and warps away, leaving you and everything you built behind."
        );
      }
    }
    resetTimer--;

    if (resetTimer == 1) {
      resetTimer = 0;
      isPlaying = false;

      if (hasWon()) {
        inputLine(
          'As the airlock of your ship hisses open the captain stands there to greet you. "Good work down there, we will be warping to a new planet momentarily."'
        );
        
      } else {
        clearConsole()
        readyCorporation()
      }
      readyNextGame()
    }

    localStorage.setItem("corporationName", corporationName);
    localStorage.setItem("playerName", playerName);
  }

  redraw();

  reset();
}

const mainTick = setInterval(tick, 250);

function oddTick() {
  odd = !odd;
}

setInterval(oddTick, 1000);
startMusic()

export {
  startGame,
  canMoveTo,
  move,
  wipe,
  world,
  terrain,
  structures,
  removeSelfWorld,
  cordToNums,
  getRandomSpot,
};
