const music1 = new Audio("https://cdn.glitch.global/c4da9c6a-10db-4bff-93eb-76703529425f/Erie.mp3?v=1747674060136")
const music2 = new Audio("https://cdn.glitch.global/c4da9c6a-10db-4bff-93eb-76703529425f/Ballad%20of%20Worlds.mp3?v=1747674071096")
const music3 = new Audio("https://cdn.glitch.global/c4da9c6a-10db-4bff-93eb-76703529425f/Row%20of%20Dead.mp3?v=1747674074663")

const music = [music1, music2, music3]

function playMusic() {
  let currentMusic = music[Math.floor(Math.random()*3)]
  currentMusic.setVolume(0.1)
  currentMusic.play().catch(function(error) {
});
  setTimeout(playMusic,currentMusic.duration)
}


function startMusic() {
  setTimeout(playMusic, 100);
}

export {startMusic}