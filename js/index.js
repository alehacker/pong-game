const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


//  gameOn = false;


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
    this.positionY = this.positionY - 5
  },
  moveDown: function () {
  this.positionY = this.positionY + 5
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
    this.positionY = this.positionY - 5
  },
  moveDown: function () {
  this.positionY = this.positionY + 5
  },
}

const keyPressed = {
  W: false,
  S: false,
  Up: false,
  Down: false
}





window.onload = () => {


  let framesPerSecond = 30;
  setInterval(() => {

    drawEverything()
    // console.log('draw all')

    updateCanvas()
    // console.log('update all')

  }, 1000/framesPerSecond);

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

function resetBall(){
  ball.x = canvas.width/2
  ball.y= canvas.height/2
  ball.speed = 5;
  ball.velocityX = -ball.velocityX
}

function collision(b,p){

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
    ball.velocityY = -ball.velocityY
  }
  //identifying which side the ball
  if (ball.x < (canvas.width/2)){
    
    player = leftPlayer;


    
  } else {
    player = rightPlayer;

  }

  // console.log(player)

  //check collision
  if (collision(ball, player)){
    let collidePoint = (ball.y - (player.positionY + (player.height/2)));
    collidePoint = collidePoint/(player.height/2);
    console.log("collide point", player)


    let angleRad = (Math.PI/4)*collidePoint;
    
    if (ball.x < canvas.width/2){
    
      console.log("flip")
      console.log("ball x", ball.x)
      console.log("canvas width", canvas.width)
      direction = 1;
    } else {

      // console.log("ball x", ball.x)
      // console.log("canvas width", canvas.width)
      console.log("other side")
      direction = -1;
  
    }

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);

    ball.speed +=0.1;

  }
  //changing score

  if (ball.x - ball.radius < 0){
    console.log("Ball", ball)
    rightPlayer.score++;
    resetBall();
  }else if (ball.x + ball.radius > canvas.width){
    leftPlayer.score++;
    resetBall();
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


//function to draw the dotted line (net)
// function drawDashedLine(pattern) {
//   ctx.beginPath();
//   ctx.setLineDash(pattern);
//   ctx.moveTo(0,y);
//   ctx.lineTo(canvas.width/2, y);
//   ctx.stroke();
//   y += 10;
// }





function drawEverything(){
  //the arena
  drawRect(0, 0, canvas.width, canvas.height, 'black'); 

  //The score
  drawText(leftPlayer.score, canvas.width/4, canvas.height/5, "white")
  drawText(rightPlayer.score, 3*canvas.width/4, canvas.height/5, "white")

  //the lines in the middle
  // drawDashedLine([10, 10]);
  // console.log('drawing net') 

 // left paddle
 drawRect(leftPlayer.positionX, leftPlayer.positionY, leftPlayer.width, leftPlayer.height, leftPlayer.color)

  //right paddle
 drawRect(rightPlayer.positionX, rightPlayer.positionY, rightPlayer.width, rightPlayer.height, rightPlayer.color)
 
  // the ball
  drawBall(ball.x, ball.y, 10, 'white');
 
}

// function game(){
//   updateCanvas()
//   drawEverything();
// }
// // number of frames per second
// let framePerSecond = 50;

// //call the game function 50 times every 1 Sec
// let loop = setInterval(game,1000/framePerSecond);



//this is the keys event --- modify for keys (W S Up Down)
// document.addEventListener('keydown', e => {
//   switch (e.keyCode) {
//     case 38:
//       player.moveUp();
//       break;
//     case 40:
//       player.moveDown();
//       break;
//     case 37:
//       player.moveLeft();
//       break;
//     case 39:
//       player.moveRight();
//       break;
//   }

// });

//this would go inside of each player as a method that would be called
//when the corresponding key is pressed
// moveLeft: function() {
//   this.x = this.x - 5
// },
// moveRight: function() {
//   this.x = this.x + 5
// },
// moveUp: function () {
//   this.y = this.y - 5
// },
// moveDown: function () {
//   this.y = this.y + 5
// },

// this is to click "start" button
// document.getElementById('start-button').onclick = () => {
  //     if (gameOn === false) {
  //       startGame();
  //     }
  //   };



// function startGame() {
//   gameOn = true

//   obstaclesArray= []
//   player.x = startingX
//   player.y = startingY

//   ctx.drawImage(road, 0, 0, 500, 700);
//   player.draw();
//   createObstacle();
//   animationLoop();
// }

// function gameOver(){
//   gameOn = false


//   console.log("Game over")
//   clearInterval(animationId)
//   clearInterval(intervalId)

//   ctx.clearRect(0, 0, 500, 700);
//   ctx.fillStyle = 'black'
//   ctx.fillRect(0, 0, 500, 700);
  

//   if (score > 14) {
//     ctx.fillStyle = "white"
//     ctx.font = '40px serif'
//     ctx.fillText("You've won!", 150, 200)
//   } else {
//     ctx.fillStyle = "white"
//     ctx.font = '40px serif'
//     ctx.fillText("You lose!", 150, 200)
//   }
  
//   obstaclesArray = []
//   score = 0;

 
// }



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



