const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// =============================================================================

let player;
let direction;
let gameOn = false;
let framesPerSecond = 30;

let startDiv = document.getElementById("start-screen");
let gameEnded = document.getElementById("game-over");
let bounceSound = document.createElement("audio");
let cheerSound = document.createElement("audio");
let offGridSound = document.createElement("audio");

bounceSound.src = "sounds/pongbounce.wav";
cheerSound.src = "sounds/cheer.wav";
offGridSound.src = "sounds/bounceoff.wav";

// =============================================================================

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 10,
    velocityX: 8,
    velocityY: 8,
    color: "white",
};

const leftPlayer = {
    positionX: 10,
    positionY: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    player: "left",
    move: 0,
    score: 0,
    keyUp: false,
    keyDown: false,
};

const rightPlayer = {
    positionX: canvas.width - 20,
    positionY: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    player: "right",
    move: 0,
    score: 0,
    keyUp: false,
    keyDown: false,
};

// =============================================================================

window.onload = () => {
    document.getElementById("start-button").onclick = () => {
        if (gameOn === false) {
            startGame();
        }
    };

    document.getElementById("restart-button").onclick = () => {
        if (gameOn === false) {
            startGame();
        }
    };

    document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
            case 38:
                rightPlayer.keyUp = true;
                break;
            case 40:
                rightPlayer.keyDown = true;
                break;
            case 87:
                leftPlayer.keyUp = true;
                break;
            case 83:
                leftPlayer.keyDown = true;
                break;
        }
    });

    document.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
            case 38:
                rightPlayer.keyUp = false;
                break;
            case 40:
                rightPlayer.keyDown = false;
                break;
            case 87:
                leftPlayer.keyUp = false;
                break;
            case 83:
                leftPlayer.keyDown = false;
                break;
        }
    });
};

// =============================================================================

// startGame starts the game loops for the game.
function startGame() {
    if (gameOn === true) {
        return;
    }

    gameOn = true;

    startDiv.style.display = "none";
    canvas.style.display = "block";
    gameEnded.style.display = "none";

    // Reset the paddle positions to original game state.
    leftPlayer.positionX = 10;
    leftPlayer.positionY = canvas.height / 2 - 100 / 2;
    rightPlayer.positionX = canvas.width - 20;
    rightPlayer.positionY = canvas.height / 2 - 100 / 2;

    // Start the game animation.
    requestAnimationFrame(animate);
}

// =============================================================================

// Animate is called by the browser before it's next refresh. Game state is
// checked and changes to the ui applied.
function animate() {
    // Check for any collision and update state.
    checkCollision();

    // Check if the game is over after any last collision.
    if (checkGameOver()) {
        return;
    }

    // Register the next animation.
    requestAnimationFrame(animate);

    // Make all the UI and state changes.
    drawBoard();
    movePaddles();
    moveBall();
}

// checkCollision detects if a collision occurred or if a point was scored.
function checkCollision() {
    switch (true) {
        case isWallCollision(ball):
            handleWallCollision();
            break;

        case isPaddleCollision(ball, rightPlayer):
            handlePaddleCollision(rightPlayer);
            break;

        case isPaddleCollision(ball, leftPlayer):
            handlePaddleCollision(leftPlayer);
            break;

        default:
            checkPointScored();
    }
}

// movePaddles changes the position of the paddles.
function movePaddles() {
    updatePaddle(leftPlayer);
    updatePaddle(rightPlayer);
}

// updatePaddle updates the position of the specified paddle.
function updatePaddle(player) {
    // Determine if we are at the top of bottom of the game area already.
    // Setting these to false will allow the move code next to ignore the
    // move event.
    switch (true) {
        case player.positionY + player.height > canvas.height:
            player.keyDown = false;
            break;

        case player.positionY < 0:
            player.keyUp = false;
            break;
    }

    // Adjust the amount of the pixels to move paddle.
    switch (true) {
        case player.keyUp:
            player.move = -12;
            break;
        case player.keyDown:
            player.move = 12;
            break;
        default:
            player.move = 0;
            break;
    }

    // Set the Y position.
    player.positionY += player.move;

    // Draw the new location of the paddle.
    drawRect(
        player.positionX,
        player.positionY,
        player.width,
        player.height,
        player.color
    );
}

// moveBall changes the position of the ball by the current velocity.
function moveBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
}

// isWallCollision detects if the specified ball hits the top or bottom wall.
function isWallCollision(b) {
    return b.y + b.radius > canvas.height || b.y - b.radius < 0;
}

// isPaddleCollision checks if the specified ball hits the specified paddle.
function isPaddleCollision(b, p) {
    p.top = p.positionY;
    p.bottom = p.positionY + p.height;
    p.left = p.positionX;
    p.right = p.positionX + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return (
        b.right > p.left &&
        b.top < p.bottom &&
        b.left < p.right &&
        b.bottom > p.top
    );
}

// handleWallCollision changes game state on a wall collision.
function handleWallCollision() {
    bounceSound.play();
    ball.velocityY = -ball.velocityY;
}

// handlePaddleCollision changes game state on a paddle collision.
function handlePaddleCollision(player) {
    bounceSound.play();

    // Check how the ball when itchecking how it collide to change direction and change speed
    let collidePoint = ball.y - (player.positionY + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    direction = -1;
    if (ball.x < canvas.width / 2) {
        direction = 1;
    }

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);

    ball.speed += 3;
}

// checkPointScored checks to see if a player scored and changes the game state.
function checkPointScored() {
    switch (isScore(ball)) {
        case "right":
            offGridSound.play();
            rightPlayer.score++;
            resetBall();
            break;

        case "left":
            offGridSound.play();
            leftPlayer.score++;
            resetBall();
            break;
    }
}

// isScore detects which player may have scored.
function isScore(b) {
    switch (true) {
        case b.x - b.radius < 0:
            return "right";
        case ball.x + ball.radius > canvas.width:
            return "left";
        default:
            return "";
    }
}

// resetBall resets the ball position to the middle after a score.
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX;
}

// checkGameOver validates if there is a winner and changes the game state.
function checkGameOver() {
    if (!(rightPlayer.score === 6 || leftPlayer.score === 6)) {
        return;
    }

    gameOn = false;

    let text;
    switch (true) {
        case leftPlayer.score > rightPlayer.score:
            text = `Left Player is the winner! Score: ${leftPlayer.score}`;
            break;

        default:
            text = `Right Player is the winner! Score: ${rightPlayer.score}`;
            break;
    }

    ctx.clearRect(0, 0, 1000, 500);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1000, 500);

    ctx.fillStyle = "white";
    ctx.font = "60px serif";
    ctx.fillText(text, 90, 250);

    cheerSound.play();

    leftPlayer.score = 0;
    rightPlayer.score = 0;

    startDiv.style.display = "none";
    gameEnded.style.display = "block";

    return true;
}

// =============================================================================

// drawBoard draws the entire game board with game state.
function drawBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawNet();

    // Draw the left player score.
    drawText(leftPlayer.score, canvas.width / 4, canvas.height / 5, "white");

    // Draw the right player score.
    drawText(
        rightPlayer.score,
        (3 * canvas.width) / 4,
        canvas.height / 5,
        "white"
    );

    drawBall(ball.x, ball.y, 10, "white");
}

// drawRect draws the specified rectangle.
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// drawNet draws the middle line.
function drawNet() {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.width);
    ctx.strokeStyle = "white";
    ctx.stroke();
}

// drawText draws text in the game board.
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = " 75px serif";
    ctx.fillText(text, x, y);
}

// drawBall draws the ball in the game board.
function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}
