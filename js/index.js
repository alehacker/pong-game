const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


 gameOn = false;

//  y = 0;

const ball = {
  x: canvas.width/2,
  y: canvas.height/2,
  radius: 10,
  speed: 5,
  velocityX: 10,
  velocityY: 8,
  color: 'white',

}


const leftPlayer = {
  positionX: 10,
  positionY: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: 'white',
  player: 'left',
  speed: 2,
  score: 0
}

const rightPlayer = {
  positionX: canvas.width - 10,
  positionY: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: 'white',
  player: 'right',
  speed: 2,
  score: 0
}





window.onload = () => {
  // document.getElementById('start-button').onclick = () => {
  //     if (gameOn === false) {
  //       startGame();
  //     }
  //   };

   framesPerSecond = 30;
  setInterval(() => {
    //call update function
    
    drawEverything()
    updateCanvas()

  }, 1000/framesPerSecond);
  
  
}

function resetBall(){
  ball.x = canvas.width/2
  ball.y= canvas.height/2
  ball.speed = 5;
  ball.velocityX = -ball.velocityX
}

function updateCanvas(){
  //incrementing x and y position of the ball
  ball.x += velocityX;
  ball.y += velocityY;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
    velocityY = -velocityY
  }

  if (ball.x < canvas.width/2){
    let player = leftPlayer;
  }else{
    let player = rightPlayer;
  }


  if (collision(ball, player)){
    let collidePoint = (ball.y - (player.y + player.height/2));
    collidePoint = collidePoint/(player.height/2);
    let angleRad = (Math.PI/4)*collidePoint;
    
    if (ball.x < canvas.width/2){
      let direction = 1;
    } else{
      let direction = -1;
    }

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);

    ball.speed +=0.1;

  }

  if (ball.x - ball.radius < 0){
    rightPlayer.score++;
    resetBall();
  }else if (ball.x + ball.radius > canvas.width){
    leftPlayer.score++;
    resetBall();
  }


}

function collision(b,p){
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.rigth = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius
  b.right = b.x +b.radius

  return (b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top)


}



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





