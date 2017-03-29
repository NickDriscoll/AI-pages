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

function onBoardClick()
{
	//Get position of click on board
	var coord = getBoardCoord();
	var row = coord[0];
	var column = coord[1];
	console.log(coord);
		
	if (board[row][column] != 'e' && selectedPiece[0] == -1 && selectedPiece[1] == -1 && turnPlayer[0] == board[row][column][0])
	{
		//Store selected piece and highlight square
		highlightSquare(context, BOARD_SIZE, row, column);
		selectedPiece = [row, column];
	}
 	else if (selectedPiece[0] != -1)
	{
		move(selectedPiece, [row, column]);
		selectedPiece = [-1, -1];
	}


	if (canJump(board, turnPlayer))
	{
		document.getElementById("victoryText").innerHTML = "Mandatory jump for " + turnPlayer;
	}
	else
	{
		document.getElementById("victoryText").innerHTML = "";
	}
}

function move(piece, destination)
{
	var successfulMove = false;
	var lastMoveWasJump = false;
	var jump = false;

	//If red piece
	if (board[piece[0]][piece[1]] == 'r')
	{
		//Normal move forward case
		if (destination[0] == piece[0] - 1 && (destination[1] == piece[1] - 1 || destination[1] == piece[1] + 1))
		{
			if (board[destination[0]][destination[1]] == 'e')
			{
				board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
				board[piece[0]][piece[1]] = 'e';
				successfulMove = true;
			}
		}

		//Jump case
		if (destination[0] == piece[0] - 2 && (destination[1] == piece[1] - 2 || destination[1] == piece[1] + 2))
		{
			//Make sure a piece is actually being jumped
			if (destination[1] - piece[1] < 0)
			{
				if (board[piece[0] - 1][piece[1] - 1][0] == 'b')
				{
					board[piece[0] - 1][piece[1] - 1] = 'e';
					board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
					board[piece[0]][piece[1]] = 'e';
					successfulMove = true;
					lastMoveWasJump = true;
				}
			}
			else
			{
				if (board[piece[0] - 1][piece[1] + 1][0] == 'b')
				{
					board[piece[0] - 1][piece[1] + 1] = 'e';
					board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
					board[piece[0]][piece[1]] = 'e';
					successfulMove = true;
					lastMoveWasJump = true;
				}
			}
		}
	}

	//If black piece
	if (board[piece[0]][piece[1]] == 'b')
	{
		//Normal move forward case
		if (destination[0] == piece[0] + 1 && (destination[1] == piece[1] - 1 || destination[1] == piece[1] + 1))
		{
			if (board[destination[0]][destination[1]] == 'e')
			{
				board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
				board[piece[0]][piece[1]] = 'e';
				successfulMove = true;
			}
		}

		//Jump case
		if (destination[0] == piece[0] + 2 && (destination[1] == piece[1] - 2 || destination[1] == piece[1] + 2))
		{
			//Make sure a piece is actually being jumped
			if (destination[1] - piece[1] < 0)
			{
				if (board[piece[0] + 1][piece[1] - 1][0] == 'r')
				{
					board[piece[0] + 1][piece[1] - 1] = 'e';
					board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
					board[piece[0]][piece[1]] = 'e';
					successfulMove = true;
					lastMoveWasJump = true;
				}
			}
			else
			{
				if (board[piece[0] + 1][piece[1] + 1][0] == 'r')
				{
					board[piece[0] + 1][piece[1] + 1] = 'e';
					board[destination[0]][destination[1]] = board[piece[0]][piece[1]];
					board[piece[0]][piece[1]] = 'e';
					successfulMove = true;
					lastMoveWasJump = true;
				}
			}
		}
	}

	if (lastMoveWasJump)
	{
		jump = canJump(board, turnPlayer);
	}

	if (successfulMove && !jump)
	{
		//Change turn player
		if (turnPlayer[0] == 'r')
		{
			turnPlayer = 'b';
		}
		else
		{
			turnPlayer = 'r';
		}
	}

	//Redraw board
	drawBoard(context, BOARD_SIZE, board);
}

function canJump(board, turnPlayer)
{
	for (var i = 0; i < BOARD_SIZE; i++)
	{
		for (var j = 0; j < BOARD_SIZE; j++)
		{
			if (board[i][j][0] == turnPlayer)
			{
				if (board[i][j][0] == 'r')
				{
					if ((i - 1 >= 0) && (i - 1 < BOARD_SIZE) && (j - 1 >= 0) && (j - 1 < BOARD_SIZE) && board[i - 1][j - 1] == 'b' || board[i - 1][j + 1] == 'b')
					{
						if ((i - 2 >= 0) && (i - 2 < BOARD_SIZE) && (j - 2 >= 0) && (j - 2 < BOARD_SIZE) && board[i - 2][j - 2] == 'e' || board[i - 2][j + 2] == 'e')
						{
							return true;
						}
					}
				}

				if (board[i][j][0] == 'b')
				{
					if ((i - 1 >= 0) && (i - 1 < BOARD_SIZE) && (j - 1 >= 0) && (j - 1 < BOARD_SIZE) && board[i + 1][j - 1] == 'r' || board[i + 1][j + 1] == 'r')
					{
						if ((i - 2 >= 0) && (i - 2 < BOARD_SIZE) && (j - 2 >= 0) && (j - 2 < BOARD_SIZE) && board[i + 2][j - 2] == 'e' || board[i + 2][j + 2] == 'e')
						{
							return true;
						}
					}
				}
			}
		}
	}
	return false;
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