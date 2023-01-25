const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ============================================================================

let player;
let direction;

let gameOn = false;

let framesPerSecond = 30;

let startDiv = document.getElementById("start-screen");
let gameEnded = document.getElementById("game-over");

let bounceSound = document.createElement("audio");
bounceSound.src = "../sounds/pongbounce.wav";

let cheerSound = document.createElement("audio");
cheerSound.src = "../sounds/cheer.wav";

let offGridSound = document.createElement("audio");
offGridSound.src = "../sounds/bounceoff.wav";

// ============================================================================

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white",
};

const leftPlayer = {
    positionX: 10,
    positionY: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    player: "left",
    speed: 2,
    score: 0,
    moveUp: function () {
        if (this.positionY >= 0) {
            this.positionY = this.positionY - 10;
        }
    },
    moveDown: function () {
        if (this.positionY + leftPlayer.height <= canvas.height) {
            this.positionY = this.positionY + 10;
        }
    },
};

const rightPlayer = {
    positionX: canvas.width - 20,
    positionY: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "white",
    player: "right",
    speed: 2,
    score: 0,
    moveUp: function () {
        if (this.positionY >= 0) {
            this.positionY = this.positionY - 10;
        }
    },
    moveDown: function () {
        if (this.positionY + leftPlayer.height <= canvas.height) {
            this.positionY = this.positionY + 10;
        }
    },
};

// ============================================================================

window.onload = () => {
    document.getElementById("start-button").onclick = () => {
        if (gameOn === false) {
            console.log("starting game");
            startGame();
        }
    };

    document.getElementById("restart-button").onclick = () => {
        if (gameOn === false) {
            console.log("re-starting game");
            startGame();
        }
    };

    document.addEventListener("keydown", (e) => {
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
};

// ============================================================================

// startGame starts the game loops for the game.
function startGame() {
    if (gameOn === true) {
        return;
    }

    gameOn = true;

    gameLoop();
    drawLoop();

    startDiv.style.display = "none";
    canvas.style.display = "block";
    gameEnded.style.display = "none";

    // Reset the paddle positions to original game state.
    leftPlayer.positionX = 10;
    leftPlayer.positionY = canvas.height / 2 - 100 / 2;
    rightPlayer.positionX = canvas.width - 20;
    rightPlayer.positionY = canvas.height / 2 - 100 / 2;
}

// gameLoop manages the game state on the specified interval.
function gameLoop() {
    gameIntervalId = setInterval(() => {
        updateCanvas();
        // console.log('update all')
    }, 1000 / framesPerSecond);
}

// drawLoop renders the game ui and updates the ui on the specified interval.
function drawLoop() {
    arenaIntervalId = setInterval(() => {
        drawBoard();
        // console.log(' draw all')
    }, 1000 / framesPerSecond);
}

// ============================================================================

// updateCanvas does the following.
function updateCanvas() {
    moveBall();

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
            checkGameOver();
    }
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

    ball.speed += 1;
}

// checkPointScored checks to see if a player scored and changes the game state.
function checkPointScored() {
    switch (whoScored(ball)) {
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

// whoScored detects which player may have scored.
function whoScored(b) {
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
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// checkGameOver validates if there is a winner and changes the game state.
function checkGameOver() {
    if (!(rightPlayer.score === 3 || leftPlayer.score === 3)) {
        return;
    }

    gameOn = false;

    clearInterval(gameIntervalId);
    clearInterval(arenaIntervalId);

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
}

// ============================================================================

// drawBoard draws the entire game board with game state.
function drawBoard() {
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

    // Draw the left paddle.
    drawRect(
        leftPlayer.positionX,
        leftPlayer.positionY,
        leftPlayer.width,
        leftPlayer.height,
        leftPlayer.color
    );

    // Draw the right paddle.
    drawRect(
        rightPlayer.positionX,
        rightPlayer.positionY,
        rightPlayer.width,
        rightPlayer.height,
        rightPlayer.color
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
