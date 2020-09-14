let WIDTH = 35;


let snake = Array(WIDTH*WIDTH);
snake[0] = Math.floor(WIDTH*WIDTH/2);

let snakeLength = 1;
let point = Array(2)
let running = false;
let sleepTime = 150;
let addingPointTime = 4000;
let highScore = 0;
let startButton = true;

let direction = 0;
// 0 - right
// 1 - down
// 2 - left
// 3 - top


let gameBox = document.getElementById("game-box");
for (let i=0; i<WIDTH; i++)
{
    let row = document.createElement("div");
    row.className = "row";
    for (let j=0; j<WIDTH; j++)
    {
        let block = document.createElement("div");
        block.className = "block";
        block.id = i*WIDTH + j;
        row.appendChild(block);
    }
    gameBox.appendChild(row);
}

let board = Array(WIDTH);
// 0 - empty
// 1 - snake
// 2 - point
for (let i=0; i<WIDTH; i++)
{
    board[i] = Array(WIDTH);
    for (let j=0; j<WIDTH; j++)
    {
        board[i][j] = 0;
    }
}


function getAddress(index)
{
    let i = Math.floor(index / WIDTH);
    let j = index - i*WIDTH;
    let toReturn = [i, j];
    
    return [i,j];
}

function getId(i, j)
{
    return i*WIDTH + j;
}

function makeBlockSnake(id)
{
    let div = document.getElementById(id);
    div.classList.remove("block");
    div.classList.add("snake");
}

function makeBlockPoint(id)
{
    let div = document.getElementById(id);
    div.classList.remove("block");
    div.classList.add("point");
}

function makePointSnake(id)
{
    let div = document.getElementById(id);
    div.classList.remove("point");
    div.classList.add("snake");
}

function makeSnakeBlock(id)
{
    let div = document.getElementById(id);
    div.classList.remove("snake");
    div.classList.add("block");
}

function showScore()
{
    document.getElementById("score").innerHTML = "Score: " + snakeLength.toString();
}

function moveSnake(i, j)
{  
    makeSnakeBlock(snake[snakeLength-1]);
    let tab = getAddress(snake[snakeLength-1]);
    board[tab[0]][tab[1]] = 0;

    for (let i=snakeLength-1; i>0; i--)
    {
        snake[i] = snake[i-1]; 
    }

    board[i][j] = 1;
    snake[0] = getId(i, j);
    makeBlockSnake(snake[0]);

}


function moveSnakeToPoint(i, j)
{
    console.log("Adding to snake");
    let id = getId(i, j);
    makePointSnake(id);
    
    snakeLength++;
    for (let i=snakeLength-2; i>=0; i--)
    {
        console.log("Swaping: snake[", i+1, "] <- snake[", i, "]");
        console.log(snake[i+1], "<-", snake[i]);
        snake[i+1] = snake[i];
    }
    snake[0] = id;
    board[i][j] = 1;

}



function newAddress()
{
    let tab = getAddress(snake[0]);
    let i = tab[0];
    let j = tab[1];

    if (direction == 0)
    {
        return [i, j+1];
    }
    else if (direction == 1)
    {
        return [i+1, j];
    }
    else if (direction == 2)
    {
        return [i, j-1];
    }
    else if (direction == 3)
    {
        return [i-1, j];
    }

}


// 0 - good
// 1 - point
// 2 - bad
function checkAddress(i, j)

{
    if (i<0 || i>=WIDTH || j<0 || j>=WIDTH || board[i][j] == 1)
    {
        return 2;
    }
    else if (board[i][j] == 2)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function setPoint()
{
    if (running)
    {
        let found = false;

    while (!found)
    {
        let i = Math.floor(Math.random()*WIDTH);
        let j = Math.floor(Math.random()*WIDTH);



        if (board[i][j] == 0)
        {
            makeBlockPoint(getId(i, j));
            board[i][j] = 2;
            found = true;
        }
    }
    }

}

function lose()
{
    running = false;
    if (snakeLength > highScore)
    {
        highScore = snakeLength;
        document.getElementById("high").innerHTML = "High Score: " + highScore.toString();
    }
    document.getElementById("score").innerHTML = "You Lost - Score: " + snakeLength.toString();
}

function start()
{
    startButton = false;
    document.getElementById("button").innerHTML = "Restart";
    running = true;
}

function isBlock(id)
{
    let tab = getAddress(id);
    if (board[tab[0]][tab[1]] == 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isPoint(id)
{
    let tab = getAddress(id);
    if (board[tab[0]][tab[1]] == 2)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isSnake(id)
{
    let tab = getAddress(id);
    if (board[tab[0]][tab[1]] == 1)
    {
        return true;
    }
    else
    {
        return false;
    }
}


function restart()
{
    running = false;
    startButton = true;
    document.getElementById("button").innerHTML = "Start";
    snake[0] = Math.floor(WIDTH*WIDTH/2);
    snakeLength = 1;

    for (let i=0; i<WIDTH; i++)
    {
        for (let j=0; j<WIDTH; j++)
        {
            board[i][j] = 0;
        }
    }

    for (let i=0; i<WIDTH*WIDTH; i++)
    {
        let block = document.getElementById(i);
        block.classList.remove("snake");
        block.classList.remove("point");
        block.classList.remove("block");
        block.classList.add("block");
        
    }

}

function buttonHandling()
{
    if (startButton)
    {
        start();
    }
    else
    {
        restart();
    }
}


function game()
{
    if (running)
    {
        let newAdd = newAddress();

        let newAddStatus = checkAddress(newAdd[0], newAdd[1]);

        if (newAddStatus == 0)
        {
            moveSnake(newAdd[0], newAdd[1]);
        }
        else if (newAddStatus == 1)
        {
            moveSnakeToPoint(newAdd[0], newAdd[1]);
        }
        else if (newAddStatus == 2)
        {
            lose();
            return;
        }
        showScore();
    }
}

document.addEventListener("keydown", (event) => 
{

    switch (event.key)
    {
        case "ArrowRight":
                direction = 0;
                break;
        case "d":
                direction = 0;
                break;

        case "ArrowDown":
            direction = 1;
            break;

        case "s":
            direction = 1;
            break;
        
        case "ArrowLeft":
            direction = 2;
            break;

        case "a":
            direction = 2;
            break;
        
        case "ArrowUp":
            direction = 3;
            break;

        case "w":
            direction = 3;
            break;
    }
}
);

setInterval(game, sleepTime);
setInterval(setPoint, addingPointTime);


