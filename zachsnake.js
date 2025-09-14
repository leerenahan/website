const playerName = prompt("Enter your name:");
document.getElementById("playerNameDisplay").innerText = `Player: ${playerName}`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const tileSize = 40; // Increased tile size for better visibility
const snakeHeadImg = new Image();
snakeHeadImg.src = "zach.png"; // Ensure this file exists

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize, 
             y: Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize };
let score = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function update() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= tileSize;
    if (direction === "DOWN") head.y += tileSize;
    if (direction === "LEFT") head.x -= tileSize;
    if (direction === "RIGHT") head.x += tileSize;

    // Game over conditions
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        saveScore();
        alert(`Game Over, ${playerName}! Your score: ${score}`);
        document.location.reload();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
        food.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
    } else {
        snake.pop();
    }
}

function saveScore() {
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort descending
    leaderboard = leaderboard.slice(0, 5); // Keep top 5
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function drawLeaderboard() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Leaderboard:", 10, 20);
    
    leaderboard.forEach((entry, index) => {
        ctx.fillText(`${index + 1}. ${entry.name}: ${entry.score}`, 10, 40 + index * 20);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake head (PNG)
    ctx.drawImage(snakeHeadImg, snake[0].x, snake[0].y, tileSize, tileSize);

    // Draw snake body
    ctx.fillStyle = "lime";
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tileSize, tileSize);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width - 180, 20);

    // Draw leaderboard
    drawLeaderboard();
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

snakeHeadImg.onload = gameLoop;