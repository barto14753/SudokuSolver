//GLOBAL VARIABLES
let SIZE = 9;
let rows = Array(SIZE);
let columns = Array(SIZE);
let sudoku = Array(SIZE);
let constSquares = Array(SIZE);


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const doSomething = async () => {
    await sleep(2000)
    //do stuff
  }

function getAddress(id)
{
    let j = id % SIZE;
    let i = (id - j)/SIZE;
    let toReturn = Array(2);
    toReturn[0] = i;
    toReturn[1] = j;
    return toReturn;
}

function getId(i, j)
{
    return i*SIZE+j;
}

function nextAddress(i, j)
{
    let toReturn = Array(2);
    if (j >= SIZE-1)
    {
        toReturn[0] = i+1;
        toReturn[1] = 0;
    }
    else
    {
        toReturn[0] = i;
        toReturn[1] = j+1;
    }
    return toReturn;
}

function isGoodAddress(i, j)
{
    return !(i<0 || i>=SIZE || j<0 || j>=SIZE);
}


function updateRowsAndColumns(self)
{
    let value = self.options[self.selectedIndex].value;
    let tab = getAddress(self.id);
    let i1 = tab[0];
    let j1 = tab[1];

    let previousValue = sudoku[i1][j1];
    sudoku[i1][j1] = value;

    rows[i1][value] = true;
    columns[j1][value] = true;

    for (let i=0; i<SIZE; i++)
    {
        let select1 = document.getElementById(getId(i1, i));
        let select2 = document.getElementById(getId(i, j1));

        select1.options[value].disabled = true;
        select2.options[value].disabled = true;

        if (previousValue != 0)
        {
            select1.options[previousValue].disabled = true;
            select2.options[previousValue].disabled = true;
        }
    }

}


function initHTML()
{
    console.log("1");
    let sudokuBox = document.getElementById("sudoku-box");
    for (let i=0; i<9; i++)
    {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let j=0; j<9; j++)
        {
            let square = document.createElement("select");
            square.id = 9*i + j;
            square.onchange = function() {updateRowsAndColumns(this);}
            square.classList.add("square");
            square.appendChild(document.createElement("option"));

            for (let k=0; k<9; k++)
            {
                let opt = document.createElement("option");
                opt.value = k+1;
                opt.innerHTML = k+1; 
                square.appendChild(opt);
            }


            row.appendChild(square);
        }

        sudokuBox.appendChild(row);
    }
}

function initRowsAndColumns()
{
    for (let i=0; i<SIZE; i++)
    {
        rows[i] = Array(SIZE+1);
        columns[i] = Array(SIZE+1);
        sudoku[i] = Array(SIZE);
        constSquares[i] = Array(SIZE);

        for (let j=0; j<SIZE+1; j++)
        {
            rows[i][j] = false;
            columns[i][j] = false;
            sudoku[i][j] = 0;
            constSquares[i][j] = false;
        }
    }
}

function init()
{
    initHTML();
    initRowsAndColumns();
}


function setConstsSquares()
{
    for (let i=0; i<SIZE; i++)
    {
        for (let j=0; j<SIZE; j++)
        {
            if (sudoku[i][j] != 0)
            {
                constSquares[i][j] = true;
                let select = document.getElementById(getId(i,j));
                select.classList.remove("square");
                select.classList.add("square-const");
            }
        }
    }
}

function resetConstSquares()
{
    for (let i=0; i<SIZE; i++)
    {
        for (let j=0; j<SIZE; j++)
        {
            if (constSquares[i][j])
            {
                constSquares[i][j] = false;
                let select = document.getElementById(getId(i,j));
                select.classList.remove("square-const");
                select.classList.add("square");
            }
        }
    }
}


function reset()
{
    document.getElementById("message-box").innerHTML = "";
    resetConstSquares();
    for (let i=0; i<SIZE; i++)
    {
        for (let j=0; j<SIZE+1; j++)
        {
            let select = document.getElementById(getId(i, j));

        
            if (sudoku[i][j] != 0)
            {
                select.classList.remove("square-move");
                select.classList.add("square");
            }

            rows[i][j] = false;
            columns[i][j] = false;
            sudoku[i][j] = 0;

            select.selectedIndex = 0;

            for (let k=0; k<SIZE; k++)
            {
                select.options[k].disabled = false;
            }
            
        }
    }
}

function nextGoodAddress(i, j)
{
    let toReturn = Array(2);
    let tab = nextAddress(i, j);

    if (!constSquares[tab[0]][tab[1]])
    {
        toReturn[0] = tab[0];
        toReturn[1] = tab[1];
        return toReturn;
    }
    else
    {
        return nextGoodAddress(tab[0], tab[1]);
    }
}

function isPossibleMove(number, i, j)
{
    return (isGoodAddress(i,j) && !rows[i][number] && !columns[j][number] && !constSquares[i][j]);
}

function addMove(number, i, j)
{
    sudoku[i][j] = number;
    rows[i][number] = true;
    columns[j][number] = true;

    let select = document.getElementById(getId(i,j));
    select.selectedIndex = number;
    select.classList.remove("square");
    select.classList.add("square-move");
}

function removeMove(number, i, j)
{
    sudoku[i][j] = 0;
    rows[i][number] = false;
    columns[j][number] = false;

    let select = document.getElementById(getId(i,j));
    select.selectedIndex = 0;
    select.classList.remove("square-move");
    select.classList.add("square");
}



function tryThis(i, j)
{
    doSomething();
    if (i == SIZE-1 && j == SIZE-1)
    {
        return true;
    }
    else
    {
        let tab = nextGoodAddress(i, j);
        for (let num=1; num<SIZE+1; num++)
        {
            if (isPossibleMove(num, tab[0], tab[1]))
            {
                addMove(num, tab[0], tab[1])
                console.log("tryThis: (", tab[0], ",",tab[0],") - ", num, getId(tab[0],tab[1]));
                if (tryThis(tab[0], tab[1]))
                {
                    return true;
                }
                removeMove(num, tab[0], tab[1])
            }
        }
        return false;
    }
}

function goodNews()
{
    document.getElementById("message-box").innerHTML = "Sucussfully solved";
}

function badNews()
{
    document.getElementById("message-box").innerHTML = "Impossible to solve";
}

function solve()
{
    setConstsSquares();
    let tab = nextGoodAddress(0, -1);
    console.log("GoodAddress:", tab);
    
    for (let num=1; num<SIZE+1; num++)
    {
        if (isPossibleMove(num,tab[0], tab[1]))
        {
            addMove(num, tab[0], tab[1]);
            if (tryThis(tab[0], tab[1]))
            {
                goodNews();
                console.log("Here");
                return true;
            }
            removeMove(num, tab[0], tab[1]);
        }
    }
    badNews();
    return false;

}


//MAIN
init();

