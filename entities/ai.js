import {
  world,
  terrain,
  structures,
  move,
  canMoveTo,
  cordToNums,
  removeSelfWorld,
} from "../../main.js";

import { getFaction } from "../factionHandler.js";

function getNearest(
  executingEntity,
  type,
  name,
  faction,
  withoutStructure,
  notFaction
) {
  let map;

  switch (type) {
    case "terrain":
      map = terrain;
      break;
    case "world":
      map = world;
      break;
    case "structures":
      map = structures;
      break;
  }

  let closestDistance = 9999;
  let closestObject = null;

  for (const object of map.entries()) {
    let distance = 0;

    if (type != "terrain") {
      distance = getDistance(object[1], executingEntity);
    } else {
      let cords = cordToNums(object[0]);

      distance = getDistancePos(
        executingEntity.getX(),
        executingEntity.getY(),
        cords[0],
        cords[1]
      );
    }

    if (distance < closestDistance) {
      let valid = true;

      if (
        (typeof object[1] === "string" && object[1] != name) ||
        (!(typeof object[1] === "string") && object[1].getName() != name)
      ) {
        valid = false;
      }

      if (faction != null) {
        if (
          (faction != object[1].getFaction() && notFaction == false) ||
          (notFaction == true && faction == object[1].getFaction())
        ) {
          valid = false;
        }
      }

      if (withoutStructure != null) {
        if (withoutStructure == structures.has(object[0])) {
          valid = false;
        }
      }

      if (valid) {
        closestObject = object;
        closestDistance = distance;
      }
    }
  }

  return closestObject;
}

function getDistancePos(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function getDistance(object1, object2) {
  return Math.sqrt(
    (object1.getX() - object2.getX()) ** 2 +
      (object1.getY() - object2.getY()) ** 2
  );
}

function getDirection(number) {
  if (number > 1) {
    number = 1;
  } else if (number < -1) {
    number = -1;
  }
  return number;
}

const explsoionAudio = new Audio(
  "https://cdn.glitch.global/c4da9c6a-10db-4bff-93eb-76703529425f/explosion-91872.mp3?v=1747673568348"
);

function moveTo(entity, newX, newY) {
  let xDirection = getDirection(newX - entity.getX());
  let yDirection = getDirection(newY - entity.getY());
  let cords = `${entity.getX() + xDirection},${entity.getY() + yDirection}`;

  if (entity.getName() == "truck") {
    if (canMoveTo(entity.getX() + xDirection, entity.getY() + yDirection)) {
      move(entity, xDirection, yDirection);
    }
  }

  if (entity.getName() == "player") {
    /*console.log(
      canMoveTo(entity.getX() + xDirection, entity.getY() + yDirection)
    );*/
    if (
      canMoveTo(entity.getX() + xDirection, entity.getY() + yDirection) &&
      !world.has(cords) &&
      (!structures.has(cords) ||
        (structures.has(cords) &&
          structures.get(cords).getFaction() == entity.getFaction()))
    ) {
      move(entity, xDirection, yDirection);
    } else if (
      world.has(cords) &&
      world.get(cords).getName() == "truck" &&
      entity.getName() != "truck"
    ) {
      let truck = world.get(cords);

      if (truck.getResource() == "metal") {
        getFaction(entity.getFaction()).changeMetal(1);
        removeSelfWorld(truck);
      } else if (truck.getResource() == "ice") {
        getFaction(entity.getFaction()).changeWater(1);
        removeSelfWorld(truck);
      }

      move(entity, xDirection, yDirection);
    }
    // beyond this the entity is fighting
    else if (entity.getSoldiers() > 0 && world.has(cords)) {
      if (entity.getFaction() =="playerFaction") {
          explsoionAudio.play()
        }
      let attackedEntity = world.get(cords);

      attackedEntity.changeSoldiers(-1);
      entity.changeSoldiers(-1);

      if (attackedEntity.getSoldiers() < 0) {
        getFaction(attackedEntity.getFaction()).wipePlayer();
        removeSelfWorld(attackedEntity);
      }
    } else if (
      canMoveTo(entity.getX() + xDirection, entity.getY() + yDirection) &&
      structures.has(cords) &&
      structures.get(cords).getFaction() != entity.getFaction() &&
      entity.getSoldiers() > 0
    ) {
      let structure = structures.get(cords);
      let faction = getFaction(structure.getFaction());

      if (structure.getName() == "factory") {
        structure.setFaction(entity.getFaction());
        move(entity, xDirection, yDirection);

        if (terrain.get(cords) == "ice") {
          faction.changeWaterMines(-1);
        } else {
          faction.changeMetalMines(-1);
        }

        if (entity.getFaction() == "playerFaction") {
          explsoionAudio.play();
        }
      } else if (structure.getName() == "city") {
        if (structure.getSoldiers() == 0) {
          faction.changeCities(-1);
          structure.setFaction(entity.getFaction());
          move(entity, xDirection, yDirection);

          if (entity.getFaction() == "playerFaction") {
            explsoionAudio.play();
          }
        } else {
          structure.changeSoldiers(-1);
          entity.changeSoldiers(-1);

          if (structure.getSoldiers() == 0) {
            faction.changeCities(-1);
            structure.setFaction(entity.getFaction());
            move(entity, xDirection, yDirection);

            if (entity.getFaction() == "playerFaction") {
              explsoionAudio.play();
            }
          }
        }
      }
    }
  }
}

export { getNearest, moveTo, getDistance };
