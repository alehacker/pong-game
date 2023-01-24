const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


 gameOn = false;


const ball = {
  x: canvas.width/2,
  y: canvas.height/2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: 'white',

}

let player
let direction

const leftPlayer = {
  positionX: 10,
  positionY: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: 'white',
  player: 'left',
  speed: 2,
  score: 0,
  moveUp: function () {
    if (this.positionY >=  0){
      this.positionY = this.positionY - 10
    }
    
  },
  moveDown: function () {
    if ((this.positionY+ leftPlayer.height) <= canvas.height){
      this.positionY = this.positionY +10
    }
  },

}

const rightPlayer = {
  positionX: canvas.width - 20,
  positionY: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: 'white',
  player: 'right',
  speed: 2,
  score: 0,
  moveUp: function () {
    if (this.positionY >=  0){
      this.positionY = this.positionY - 10
    }
    
  },
  moveDown: function () {
    if ((this.positionY+ leftPlayer.height) <= canvas.height){
      this.positionY = this.positionY +10
    }
  },
}

let framesPerSecond = 30;
function gameLoop(){
  gameIntervalId = setInterval(()=>{
    updateCanvas()
    // console.log('update all')

  }, 1000/framesPerSecond);
}

function drawArena(){
  arenaIntervalId = setInterval(()=>{
    drawEverything()
    // console.log(' draw all')
  }, 1000/framesPerSecond);
}



function resetBall(){
  ball.x = canvas.width/2
  ball.y= canvas.height/2
  ball.speed = 5;
  ball.velocityX = -ball.velocityX
}

function collission(b,p){

  p.top = p.positionY;
  p.bottom = p.positionY + p.height;
  p.left = p.positionX;
  p.right = p.positionX + p.width;

  b.top = b.y- b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius
  b.right = b.x + b.radius


  return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;

}

function updateCanvas(){
  //incrementing x and y position of the ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
    //play bounce sound here
    ball.velocityY = -ball.velocityY
  }
  //identifying which side the ball is
  if (ball.x < (canvas.width/2)){
    player = leftPlayer;
  } else {
    player = rightPlayer;
  }

  // console.log(player)

  //check collission
  if (collission(ball, player)){
    //play bounce sound here
    let collidePoint = (ball.y - (player.positionY + (player.height/2)));
    collidePoint = collidePoint/(player.height/2);


    let angleRad = (Math.PI/4)*collidePoint;
    
    if (ball.x < canvas.width/2){
      direction = 1;
    } else {
      direction = -1;
    }

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);

    ball.speed +=1;
  }

  //changing score

  if (ball.x - ball.radius < 0){
    // console.log("Ball", ball)
    //play bounce out sounde/ score sound
    rightPlayer.score++;
    resetBall();
  }else if (ball.x + ball.radius > canvas.width){
    //play bounce out sounde/ score sound
    leftPlayer.score++;
    resetBall();
  }

  if (rightPlayer.score  === 1  || leftPlayer.score === 1){
    gameOver()
    console.log('accessed gameOver function')
  }


}




function drawRect(x, y, w, h, color){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color){
  ctx.fillStyle = color;
  ctx.font = " 75px serif" 
  ctx.fillText(text, x, y);
}

function drawNet(){
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.width);
  ctx.strokeStyle = "white"
  ctx.stroke();
}





function drawEverything(){
  //the arena
  drawRect(0, 0, canvas.width, canvas.height, 'black');
  
  //The Net
  drawNet();

  //The score
  drawText(leftPlayer.score, canvas.width/4, canvas.height/5, "white")
  drawText(rightPlayer.score, 3*canvas.width/4, canvas.height/5, "white")


 // left paddle
 drawRect(leftPlayer.positionX, leftPlayer.positionY, leftPlayer.width, leftPlayer.height, leftPlayer.color)

  //right paddle
 drawRect(rightPlayer.positionX, rightPlayer.positionY, rightPlayer.width, rightPlayer.height, rightPlayer.color)
 
  // the ball
  drawBall(ball.x, ball.y, 10, 'white');
 
}



function startGame() {

  if (gameOn === false){
    console.log("GameOn at the beginning of startGame", gameOn)
    gameOn = true
    console.log("GameOn after change value", gameOn)
    gameLoop()
    drawArena()
  }



}


function gameOver() {
  gameOn = false


//resest everything : score, ball position, ball speed...
  clearInterval(gameIntervalId)
  clearInterval(arenaIntervalId)

  console.log("Game over")
  console.log("GameOn", gameOn)
  
  
  ctx.clearRect(0,0,1000,500)
  ctx.fillStyle = 'black'
  ctx.fillRect(0,0,1000,500)

  //declare winner below compare leftPaddle.score to rightPaddle.score
  
  if (leftPlayer.score > rightPlayer.score) {
    //play fanfare sound here
    ctx.fillStyle = "white"
    ctx.font = '50px serif'
    ctx.fillText(`Left Player is the winner! Score: ${leftPlayer.score}`, 90, 250)
  } else {
    //play fanfare sound here
    ctx.fillStyle = "white"
    ctx.font = '60px serif'
    ctx.fillText(`Right Player is the winner! Score: ${rightPlayer.score}`, 90, 250)
  }

  leftPlayer.score = 0
  rightPlayer.score = 0
  
}

window.onload = () => {

  document.getElementById('start-button').onclick = () => {

      if (gameOn === false) {
        console.log('starting game')
        //play starting music
        startGame();
      }
  };



  document.addEventListener('keydown', e => {
      switch (e.keyCode) {
        case 38:
          rightPlayer.moveUp();
          break;
        case 40:
          rightPlayer.moveDown();
          break;
        case 87:
          leftPlayer.moveUp();
          break;
        case 83:
          leftPlayer.moveDown();
          break;
      }
    
    });
  
}





//**************************/
//******* TRASH ************/
//**************************/

//I don't need this for now...
// function moveEverything(){
//   ballX = ballX + ballSpeedX;
//   ballY = ballY + ballSpeedY;

//   if (ballX < 0){
//     ballSpeedX = -ballSpeedX;
//   }
//   if (ballX > canvas.width){
//     ballSpeedX = -ballSpeedX;
//   }

//   if (ballY < 0){
//     ballSpeedY= -ballSpeedY;
//   }
//   if (ballY> canvas.height){
//     ballSpeedY= -ballSpeedY;
//   }

// }



