import { world, structures, terrain } from "./main.js";
import { City } from "./structures/city.js";
import { Factory } from "./structures/factory.js";
import { Truck } from "./entities/truck.js";
import { getFaction } from "./factionHandler.js";

const buildAudio = new Audio("https://cdn.glitch.global/c4da9c6a-10db-4bff-93eb-76703529425f/house-building-89157.mp3?v=1747672941954")

function executeAction(name, executingEntity) {
  let cords = `${executingEntity.getX()},${executingEntity.getY()}`;
  let faction = getFaction(executingEntity.getFaction());

  switch (name) {
    case "Build City":
      if (
        !structures.has(cords) &&
        faction.getMetal() >= 5 &&
        faction.getWater() >= 5
      ) {
        structures.set(
          cords,
          new City(
            executingEntity.getX(),
            executingEntity.getY(),
            executingEntity.getFaction()
          )
        );

        faction.changeMetal(-5);
        faction.changeWater(-5);
        faction.changeCities(1);
        
        if (executingEntity.getFaction()=="playerFaction") {
          buildAudio.play()
        }
      }
      break;
    case "Build Mine":
      if (
        !structures.has(cords) &&
        (terrain.get(cords) == "metal" || terrain.get(cords) == "ice") &&
        faction.getMetal() >= 3 &&
        faction.getWater() >= 1
      ) {
        structures.set(
          cords,
          new Factory(
            executingEntity.getX(),
            executingEntity.getY(),
            faction.getName(),
            "metal"
          )
        );

        faction.changeMetal(-3);
        faction.changeWater(-1);
        
        if (terrain.get(cords) == "metal") {
          faction.changeMetalMines(1)
        }
        else if (terrain.get(cords) == "ice") {
          faction.changeWaterMines(1)
        }
        
        if (executingEntity.getFaction()=="playerFaction") {
          buildAudio.play()
        }
      }
      break;
    case "Make Truck":
      if (!world.has(cords)) {
        world.set(
          cords,
          new Truck(
            executingEntity.getX(),
            executingEntity.getY(),
            executingEntity.getFaction(),
            terrain.get(cords)
          )
        );
      }
      break;
    case "Train Soldier":
      if (
        structures.has(cords) &&
        structures.get(cords).getName() == "city" &&
        structures.get(cords).getFaction() == executingEntity.getFaction() &&
        getFaction(executingEntity.getFaction()).getMetal() >= 10 &&
        getFaction(executingEntity.getFaction()).getWater() >= 5
      ) {
        structures.get(cords).changeSoldiers(1);
        getFaction(executingEntity.getFaction()).changeMetal(-10);
        getFaction(executingEntity.getFaction()).changeWater(-5);
      }
      break;
    case "Take Soldier":
      if (
        structures.has(cords) &&
        structures.get(cords).getName() == "city" &&
        structures.get(cords).getFaction() == executingEntity.getFaction() &&
        structures.get(cords).getSoldiers() > 0
      ) {
        structures.get(cords).changeSoldiers(-1);
        getFaction(executingEntity.getFaction()).getPlayer().changeSoldiers(1);
      }
      break;
    case "Put Soldier":
      if (
        structures.has(cords) &&
        structures.get(cords).getName() == "city" &&
        structures.get(cords).getFaction() == executingEntity.getFaction() &&
        getFaction(executingEntity.getFaction()).getPlayer().getSoldiers() > 0
      ) {
        structures.get(cords).changeSoldiers(1);
        getFaction(executingEntity.getFaction()).getPlayer().changeSoldiers(-1);
      }
      break;
  }
}

export { executeAction };
