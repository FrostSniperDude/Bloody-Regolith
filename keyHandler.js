var upPressed = false,
  downPressed = false,
  rightPressed = false,
  leftPressed = false;

document.addEventListener("keydown", function (event) {
  //console.log(event);
  if (event.key === "ArrowUp" || event.key == "w") {
    upPressed = true;
  }
  if (event.key === "ArrowRight" || event.key == "d") {
    rightPressed = true;
  }
  if (event.key === "ArrowDown" || event.key == "s") {
    downPressed = true;
  }
  if (event.key === "ArrowLeft" || event.key == "a") {
    leftPressed = true;
  }
});

function reset() {
  upPressed = false;
  rightPressed = false;
  downPressed = false;
  leftPressed = false;
}

export { reset, upPressed, downPressed, rightPressed, leftPressed };
