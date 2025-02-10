
let board;
let context;
let boardWidth = 400;
let boardHeight = 690;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function () {
  board = document.getElementById("canvas");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // Load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  // Start the game loop
  requestAnimationFrame(update);
  setInterval(placePipes, 1500); // Create pipes every 1.5 seconds
  document.addEventListener("keydown", moveBird);
  board.addEventListener("click", moveBird);
};

// Update game state
function update() {
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  velocityY += gravity;
  bird.y = Math.min(Math.max(bird.y + velocityY, 0), board.height - bird.height);


  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX; // Move the pipe to the left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }



    if (detectCollision(bird, pipe)){
      gameOver = true;
    }
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
    pipeArray.shift();
  }

  context.fillStyle = 'white';
  context.font = '45px Arial';
  context.fillText(Math.floor(score), 5, 45);

  // Request the next animation frame
  requestAnimationFrame(update);
}

// Place new pipes at regular intervals
function placePipes() {

  if (gameOver){
    return;
  }

  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2;
  let openingSpace = board.height/4


  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  }
  pipeArray.push(bottomPipe);
}


function moveBird(e){
  if (e.type === "click" || e.code === "Space" || e.code === "ArrowUp") {
    if (gameOver) {
      // Reset game state
      bird.y = boardHeight / 2;
      pipeArray = [];
      gameOver = false;
      score = 0;
      velocityY = -6;
      // Restart game loop
      requestAnimationFrame(update);
    } else {
      velocityY = -6;
    }
  }
}

function detectCollision(a, b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;

}
