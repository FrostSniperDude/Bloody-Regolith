import { startGame, wipe } from "./main.js";

const canvas = document.getElementById("canvas");
const input = document.getElementById("input");

const messages = [];
const paragraphMessages = [];
const ctx = canvas.getContext("2d");

const canvasStyle =
  "position: absolute; left: " +
  String(screen.width - 450) +
  "px; border: 1px solid #000000; width:400px; height:400px";

canvas.setAttribute("style", canvasStyle);

const inputStyle =
  "position: absolute; left: " +
  String(screen.width - 450) +
  "px; width:394px; height:20px; top: 422px";

input.setAttribute("style", inputStyle);

var enterDebounce = false;
// init for input
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Enter" &&
    document.activeElement == input &&
    enterDebounce == false
  ) {
    inputCommand(input.value);
    input.value = "";
    enterDebounce = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    enterDebounce = false;
  }
});

function inputCommand(inputText) {
  inputText = inputText.toLowerCase();

  switch (inputText) {
    case "launch":
      startGame();
      break;
    case "long":
      inputLine(
        "This line is super duper very long now I will say loreum ispum I think I spelled that correctly"
      );
      break;
    case "wipe":
      wipe();
      break;
  }
}

function inputLine(text) {
  messages.unshift(text);

  for (var i = 0; i < paragraphMessages.length; i++) {
    paragraphMessages[i].remove();
  }

  let extraHeight = 0;

  for (var i = 0; i < messages.length; i++) {
    let newElement = document.createElement("p");
    paragraphMessages.push(newElement);
    document.body.appendChild(newElement);
    newElement.innerHTML = messages[i];

    let style =
      "position: absolute; left: " +
      String(screen.width - 445) +
      "px; top: " +
      String(420 - 18 * (i+2) - extraHeight) +
      "px;";
    newElement.setAttribute("style", style);

    let elementHeight = window.getComputedStyle(newElement).height;
    elementHeight =
      Number(elementHeight.substring(0, elementHeight.length - 2)) +
      parseFloat(window.getComputedStyle(newElement).marginTop) +
      parseFloat(window.getComputedStyle(newElement).marginBottom);

    style =
      "position: absolute; left: " +
      newElement.style.left +
      "; top: " +
      String(420 - 18 * (i+2) - extraHeight - (elementHeight - 18)) +
      "px; width: 390px";
    newElement.setAttribute("style", style);

    extraHeight += elementHeight - 18;
  }
}

function clearConsole() {
  for (var i = 0; i < paragraphMessages.length; i++) {
    paragraphMessages[i].remove();
  }
  paragraphMessages.length = 0
  messages.length = 0
}

export { inputCommand, inputLine, clearConsole};
