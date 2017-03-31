//Draw the board
function drawBoard(context, size, board)
{	
	//Squares
	for (var i = 0; i < size; i++)
	{
		for (var j = 0; j < size; j++)
		{
			if ((i + j) % 2 == 0)
			{
				context.fillStyle = "#eaae5b";
			}
			else
			{
				context.fillStyle = "#aa6c14";
			}
			context.fillRect(canvas.width * i / size, canvas.height * j / size, canvas.width / size, canvas.height / size);
		}
	}

	//Lines
	context.strokeStyle = "#000000";
	for (var i = 1; i < size; i++)
	{
		//Vertical
		context.moveTo(canvas.width * i / size, 0);
		context.lineTo(canvas.width * i / size, canvas.height);
		context.stroke();

		//Horizontal
		context.moveTo(0, canvas.height * i / size);
		context.lineTo(canvas.width, canvas.height * i / size);
		context.stroke();
	}
	

	//Draw pieces
	var radius = canvas.width / 24;
	for (var i = 0; i < size; i++)
	{
		for (var j = 0; j < size; j++)
		{			
			if (board[i][j] == 'r')
			{
				context.beginPath();
				context.arc(j * canvas.width / size + 1.5*radius, i * canvas.height / size + 1.5*radius, radius, 0, 2*Math.PI);
				context.fillStyle = "#FF0000";
				context.fill();
			}
			else if (board[i][j] == 'b')
			{
				context.beginPath();
				context.arc(j * canvas.width / size + 1.5*radius, i * canvas.height / size + 1.5*radius, radius, 0, 2*Math.PI);
				context.fillStyle = "#000000";
				context.fill();
			}
		}
	}
	
	//Reset context position
	//context.arc(0, 0, 0, 0, 0);
}

function highlightSquare(context, size, x, y)
{
	context.strokeStyle = "#FFFF00";

	context.moveTo(canvas.height * y / size, canvas.width * x / size);
	context.lineTo(canvas.height * (y + 1) / size, canvas.width * x / size);
	context.stroke();
	context.stroke();

	context.moveTo(canvas.height * y / size, canvas.width * x / size);
	context.lineTo(canvas.height * y / size, canvas.width * (x + 1) / size);
	context.stroke();
	context.stroke();

	context.moveTo(canvas.height * (y + 1) / size, canvas.width * x / size);
	context.lineTo(canvas.height * (y + 1) / size, canvas.width * (x + 1) / size);
	context.stroke();
	context.stroke();

	context.moveTo(canvas.height * y / size, canvas.width * (x + 1) / size);
	context.lineTo(canvas.height * (y + 1) / size, canvas.width * (x + 1) / size);
	context.stroke();
	context.stroke();
}

function getBoardCoord()
{
	var rect = canvas.getBoundingClientRect();
	var x = -1;
	var y = -1;

	//Find xPos
	for (var i = 0; i < BOARD_SIZE && x == -1; i++)
	{
		if (canvas.height * i / BOARD_SIZE < event.clientY - rect.top && event.clientY - rect.top < canvas.height * (i + 1) / BOARD_SIZE)
		{
			x = i;
		}
	}

	//Find yPos
	for (var i = 0; i < BOARD_SIZE && y == -1; i++)
	{
		if (canvas.width * i / BOARD_SIZE < event.clientX - rect.left && event.clientX - rect.left < canvas.width * (i + 1) / BOARD_SIZE)
		{
			y = i;
		}
	}

	return [x, y];
}

function isFacingOpponent(board, turnPlayer, row, column)
{
	if (turnPlayer == 'r')
	{
		return board[row - 1][column - 1] == 'b' || board[row - 1][column + 1] == 'b';
	}
	else
	{
		return board[row + 1][column - 1] == 'r' || board[row + 1][column + 1] == 'r';
	}
}

function isInFrontOf(board, x, y, a, b)
{
	var turnPlayer = board[x][y];

	if (turnPlayer == 'r')
	{
		return a == x - 1 && (b == y - 1 || b == y + 1);
	}
	else
	{
		return a == x + 1 && (b == y - 1 || b == y + 1);
	}
}

function isEmpty(board, x, y)
{
	return board[x][y] == 'e';
}

function canJump(board, x, y)
{
	var turnPlayer = board[x][y];
	if (turnPlayer == 'r')
	{
		if (board[x - 1][y - 1] == 'b' || board[x - 1][y + 1] == 'b')
		{
			return board[x - 2][y - 2] == 'e' || board[x - 2][y + 2] == 'e';
		}
	}
	else
	{
		if (board[x + 1][y - 1] == 'r' || board[x + 1][y + 1] == 'r')
		{
			return board[x + 2][y - 2] == 'e' || board[x + 2][y + 2] == 'e';
		}
	}
}

function turnPlayerCanJump(board, turnPlayer)
{
	for (var i = 0; i < BOARD_SIZE; i++)
	{
		for (var j = 0; j < BOARD_SIZE; j++)
		{
			if (board[i][j] == turnPlayer && canJump(board, i, j))
			{
				return true;
			}
		}
	}
	return false;
}

function canJumpUpdate(board, turnPlayer)
{
	if (turnPlayerCanJump(board, turnPlayer))
	{
		document.getElementById("victoryText").innerHTML = "Mandatory jump for " + turnPlayer;
	}
	else
	{
		document.getElementById("victoryText").innerHTML = "";		
	}
}

function onBoardClick()
{
	var coord = getBoardCoord();

	//Case where no piece is selected
	if (selectedPiece[0] == -1)
	{
		if (board[coord[0]][coord[1]] == turnPlayer)
		{
			selectedPiece[0] = coord[0];
			selectedPiece[1] = coord[1];
			highlightSquare(context, BOARD_SIZE, coord[0], coord[1]);
		}
	}
	//Case where piece is selected
	else
	{
		var inFront = isInFrontOf(board, selectedPiece[0], selectedPiece[1], coord[0], coord[1]);
		if (inFront && board[coord[0]][coord[1]] == 'e')
		{
			board[coord[0]][coord[1]] = board[selectedPiece[0]][selectedPiece[1]];
			board[selectedPiece[0]][selectedPiece[1]] = 'e';
		
			//Switch player
			if (turnPlayer == 'r')
			{
				turnPlayer = 'b';
			}
			else
			{
				turnPlayer = 'r';
			}
		}
		
		canJumpUpdate(board, turnPlayer);
		selectedPiece = [-1, -1];
		drawBoard(context, BOARD_SIZE, board);
	}
}

var BOARD_SIZE = 8;

var canvas = document.getElementById("board");
canvas.addEventListener('click', onBoardClick, false);
var context = canvas.getContext("2d");

//Var to store currently selected piece
var selectedPiece = [-1, -1];

//Var to store whose turn it is
var turnPlayer = 'r';

//Init board
var board = [['b','e','b','e','b','e','b','e'],['e','b','e','b','e','b','e','b'],
			 ['b','e','b','e','b','e','b','e'],['e','e','e','e','e','e','e','e'],
			 ['e','e','e','e','e','e','e','e'],['e','r','e','r','e','r','e','r'],
			 ['r','e','r','e','r','e','r','e'],['e','r','e','r','e','r','e','r']];

drawBoard(context, BOARD_SIZE, board);