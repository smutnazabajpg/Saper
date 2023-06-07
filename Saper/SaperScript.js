let board;
let gameFinished;
let numberOfBombs;
let rowCount;
let collumnCount;
let specialSigns = ['🚩','❓', ''];
let uncoverFields;
let fieldsWithBomb = [];

window.oncontextmenu = function(evt)
{
    evt.preventDefault();
};

function Run()
{
    ClearBoard();
    if(ValidInputCheck())
    {
        SetBoard();
        SpawnBombs();
        gameFinished = false;
    }
}
function ClearBoard()
{
    document.getElementById("board").innerHTML = "";
}
function SetBoard(){
    rowCount = document.getElementById("boardRowCount").value;
    collumnCount = document.getElementById("boardCollumnCount").value
    uncoverFields = rowCount * collumnCount;
    CreateBoardTable(rowCount > collumnCount ? rowCount: collumnCount);
    CreateBoardUI();
}
function CreateBoardTable(boardSize)
{
    board = [];
    for (let i = 0; i < boardSize; i++)
        board[i] = [];
}
function CreateBoardUI()
{
    let boardUI = document.createElement("table");
    document.getElementById("board").appendChild(boardUI);
    FillBoard(boardUI);
}
function FillBoard(boardUI){
    for (let rowNumber = 0; rowNumber < rowCount; rowNumber++)
    {
        let row = GetNewRow(rowNumber);
        boardUI.appendChild(row);
    }
}
function GetNewRow(rowNumber){
    let row = document.createElement("tr");
    for (let collumnNumber = 0; collumnNumber < collumnCount; collumnNumber++)
    {
        row.appendChild(GetNewField(rowNumber, collumnNumber));
    }
    return row;
}
function GetNewField(row, collumn)
{
    let field = new Field(document.createElement("button"), row, collumn);
    field.element.className = "BoardField";
    board[row][collumn] = field;
    return field.element;
}
function ValidInputCheck()
{
    numberOfBombs = document.getElementById("numberOfBombsTag").value;
    rowCount = document.getElementById("boardRowCount").value;
    collumnCount = document.getElementById("boardCollumnCount").value;
    
    return (rowCount > 0
        && collumnCount > 0
        && numberOfBombs > 0
        && numberOfBombs < (rowCount * collumnCount));
}
function FieldClickEventHandler(row, collumn)
{
    let field = board[row][collumn];
    if(field.element.innerText != ''
        || gameFinished)
        return;
    else if(field.isBomb)
        GameOver(false);
    else
    {
        field.element.className = "ActiveBoardField";
        bombs = GetNumberOfBombs(row, collumn)
        field.element.innerText = bombs == 0 ?'ㅤ':bombs;
        if(--uncoverFields == numberOfBombs)
            GameOver(true);
        else if (field.element.innerText == 'ㅤ')
            UncoverTheFogOfWar(row, collumn);
    }


}
function GameOver(win)
{
    UncoverBombs();
    setTimeout(()=>
        {
            if(win)
                alert("Wygrałeś")
            else
                alert("youDied")
            gameFinished = true;
        }, 100)
}
function GetNumberOfBombs(row, collumn)
{
    let numberOfBombs = 0;

    for (let i = -1; i < 2; i++)
    {
        for (let j = -1; j < 2; j++)
        {
            if(CheckFieldIsDefined(row - i, collumn - j)
               && board[row - i][collumn - j].isBomb)
                numberOfBombs++;
        }
    }
    return numberOfBombs;
}
function SpawnBombs()
{
    for (let i = 0; i < numberOfBombs; i++) 
    {
        let randRow = Math.floor(Math.random() * rowCount);
        let randCollumn = Math.floor(Math.random() * collumnCount)
        if(!board[randRow][randCollumn].isBomb)
        {
            board[randRow][randCollumn].isBomb = true;
            fieldsWithBomb.push(board[randRow][randCollumn])
        }
        else
            i--;
    }
}
function UncoverTheFogOfWar(row, collumn)
{
    let tmpRow;
    let tmpCollumn;
    for (let i = -1; i < 2; i++)
    {
        for (let j = -1; j < 2; j++)
        {
            tmpRow = row - i;
            tmpCollumn = collumn - j;

            if(CheckFieldIsDefined(tmpRow, tmpCollumn))
            {
                FieldClickEventHandler(tmpRow, tmpCollumn)
            }
        }
    }
}
function CheckFieldIsDefined(row, collumn)
{
    return (board[row] !== undefined
    && board[row][collumn] !== undefined)
}
function UncoverBombs()
{
    fieldsWithBomb.forEach(field => {
        field.element.innerText = "💣"
    });
}
class Field
{
    constructor(element, row, collumn)
    {
        this.isBomb = false;
        this.element = element;  
        this.sn = 0;

        element.addEventListener("click", () => {
            if(!isNaN(parseInt(element.innerText)))
            {
                UncoverTheFogOfWar(row, collumn)
            }
            FieldClickEventHandler(row, collumn);
        });

        element.addEventListener("auxclick", () => {
            if(isNaN(parseInt(element.innerText))
               && !gameFinished)
            {
                this.element.innerText = specialSigns[this.sn];
                this.sn++;
                this.sn %= 3;
            }
        });
    }
}
