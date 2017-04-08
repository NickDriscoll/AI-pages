//Draw the board
function drawBoard(context, size)
{	
	context.clearRect(0, 0, canvas.width, canvas.height);
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
}

function drawMove(turnPlayer, x, y)
{
	//Draw x or o
	if (turnPlayer == "x")
	{
		context.drawImage(xImg, (canvas.height / 6) + (canvas.height * y / 3) - (xImg.height / 2), (canvas.width / 6) + (canvas.width * x / 3) - (xImg.width / 2));
	}
	else
	{
		context.drawImage(oImg, (canvas.height / 6) + (canvas.height * y / 3) - (oImg.width / 2), (canvas.width / 6) + (canvas.width * x / 3) - (oImg.width / 2));
	}
}

function drawAll(board)
{
	drawBoard(context, 3);
	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			if (board[i][j] == 'x')
			{
				drawMove('x', i, j);
			}
			else if (board[i][j] == 'o')
			{
				drawMove('o', i, j);
			}
		}
	}
}

function maxIndex(arr)
{
	var max = 0;
	for (var i = 1; i < arr.length; i++)
	{
		if (arr[i] > arr[max])
		{
			max = i;
		}
	}
	return max;
}

function minIndex(arr)
{
	var min = 0;
	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i] < arr[min])
		{
			min = i;
		}
	}
	return min;
}

function score(board, turnPlayer, depth)
{
	if (checkForVictory(board) == 'n')
	{
		return 0 + depth;
	}
	else if (checkForVictory(board) == 'o')
	{
		return 10 - depth;
	}
	else if (checkForVictory(board) == 'x')
	{
		return -10 + depth;
	}
}

function minimax(board, turnPlayer, depth)
{
	if (checkForVictory(board) != "")
	{
		return [0, 0, score(board, turnPlayer, depth)];
	}

	var d = new Date();
	var timer = d.getTime();

	depth += 1;

	var start = (new Date).getTime();

	//Create arrays to store moves and their respective scores
	var moves = [];
	var scores = [];

	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			if (board[i][j] == "")
			{
				board[i][j] = turnPlayer;
				moves.push([i, j]);

				//Change turn player
				if (turnPlayer == 'o')
				{
					turnPlayer = 'x';
				}
				else
				{
					turnPlayer = 'o';
				}

				scores.push(minimax(board, turnPlayer, depth)[2]);

				//Change turn player
				if (turnPlayer == 'o')
				{
					turnPlayer = 'x';
				}
				else
				{
					turnPlayer = 'o';
				}

				board[i][j] = "";
			}
		}
	}

	//console.log("Moves: " + moves);
	//console.log("Scores: " + scores);
	if (depth == 1)
	{
		console.log("Calculated turn in " + ((new Date).getTime() - start) + " milliseconds");
	}

	//Minimize or maximize
	if (turnPlayer == 'o')
	{
		var maxi = maxIndex(scores);
		//board[moves[maxi][0]][moves[maxi][1]] = turnPlayer;
		return [moves[maxi][0], moves[maxi][1], scores[maxi]];
	}
	else
	{
		var mini = minIndex(scores);
		//board[moves[mini][0]][moves[mini][1]] = turnPlayer;
		return [moves[mini][0], moves[mini][1], scores[mini]];
	}

}

//Returns the array [xPos, yPos, score, alpha, beta]
function minimaxAlphaBetaInternal(board, turnPlayer, depth, alpha, beta)
{
	if (checkForVictory(board) != "")
	{
		return [0, 0, score(board, turnPlayer, depth)];
	}

	var moves = [];
	var scores = [];

	depth += 1;

	var start = (new Date).getTime();

	//Descend the treeeeeee
	for (var i = 0; i < 3 && alpha < beta; i++)
	{
		for (var j = 0; j < 3 && alpha < beta; j++)
		{			

			if (board[i][j] == "")
			{
				board[i][j] = turnPlayer;

				moves.push([i, j]);

				//Change turn player
				if (turnPlayer == 'o')
				{
					turnPlayer = 'x';
				}
				else
				{
					turnPlayer = 'o';
				}

				var currentScore = minimaxAlphaBetaInternal(board, turnPlayer, depth, alpha, beta);

				scores.push(currentScore[2]);

				//Assign the current score to alpha if this is a max node, beta if it's a min node
				if (turnPlayer == 'o' && currentScore[3] > alpha)
				{
					alpha = currentScore;
				}
				else if (currentScore[4] < beta)
				{
					beta = currentScore;
				}

				//Change turn player
				if (turnPlayer == 'o')
				{
					turnPlayer = 'x';
				}
				else
				{
					turnPlayer = 'o';
				}

				board[i][j] = "";
			}
		}
	}

	//Minimize or maximize
	if (turnPlayer == 'o')
	{
		var maxi = maxIndex(scores);
		//board[moves[maxi][0]][moves[maxi][1]] = turnPlayer;
		return [moves[maxi][0], moves[maxi][1], scores[maxi], alpha, beta];
	}
	else
	{
		var mini = minIndex(scores);
		//board[moves[mini][0]][moves[mini][1]] = turnPlayer;
		return [moves[mini][0], moves[mini][1], scores[mini], alpha, beta];
	}

}

function minimaxAlphaBeta(board, turnPlayer)
{
	return minimaxAlphaBetaInternal(board, turnPlayer, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
}

function aiTurn(board)
{
	var start = (new Date).getTime();
	//var re = minimax(board, turnPlayer, 0);
	var re = minimaxAlphaBeta(board, turnPlayer);

	console.log("Calculated turn in " + ((new Date).getTime() - start) + " milliseconds");

		board[re[0]][re[1]] = turnPlayer;
		drawMove(turnPlayer, re[0], re[1]);
		//Change turn player
		if (turnPlayer == 'o')
		{
			turnPlayer = 'x';
		}
		else
		{
			turnPlayer = 'o';
		}

		if (checkForVictory(board) != "")
		{
			declareVictor(board);
		}
}

function changeStartingPlayer()
{
	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			if (board[i][j] != '')
			{
				return;
			}
		}
	}

	turnPlayer = 'o';
	aiTurn(board);
}

function onBoardClick(event)
{
	if (checkForVictory(board) != "")
	{
		console.log("There's already a winner.");
		return;
	}

	var rect = canvas.getBoundingClientRect();
	var string = "In position (";
	var x;
	var y;

	if (event.clientY - rect.top < canvas.height / 3)
	{
		string += "0,";
		x = 0;
	}
	else if (event.clientY - rect.top > canvas.height / 3 && event.clientY - rect.top < canvas.height * 2 / 3)
	{
		string += "1,";
		x = 1;
	}
	else
	{
		string += "2,";
		x = 2;
	}

	if (event.clientX - rect.left < canvas.width / 3)
	{
		string += "0)";
		y = 0;
	}
	else if (event.clientX - rect.left > canvas.width / 3 && event.clientX - rect.left < canvas.width * 2 / 3)
	{
		string += "1)";
		y = 1;
	}
	else
	{
		string += "2)";
		y = 2;
	}

	console.log(string);

	//If space has already been filled, ignore input
	if (board[x][y] != '')
	{
		return;
	}

	//Draw x or o
	if (turnPlayer == "x")
	{
		board[x][y] = 'x';
		drawMove(turnPlayer, x, y);
		turnPlayer = "o";
	}
	else
	{
		board[x][y] = 'o';
		drawMove(turnPlayer, x, y);
		turnPlayer = "x";
	}

	//Check if a player has now won
	if (checkForVictory(board) == "")
	{
		aiTurn(board);
	}
	else
	{
		declareVictor(board);
	}
}

//Returns a winner if someone won, "" otherwise
function checkForVictory(board)
{
	var victor = "";
	var tie = true;	

	//Check rows
	for (var i = 0; i < 3; i++)
	{
		if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != "")
		{
			victor = board[i][0];
		}
	}

	//Check columns
	for (var i = 0; i < 3; i++)
	{
		if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != "")
		{
			victor = board[0][i];
		}
	}

	//Check diagonal
	if (board[0][0] == board[1][1] && board[2][2] == board[1][1] && board[1][1] != "")
	{
		victor = board[1][1];
	}
	if (board[1][1] == board[2][0] && board[1][1] == board[0][2] && board[1][1] != "")
	{
		victor = board[1][1];
	}

	if (victor == "")
	{
		//Check for tie
		for (var i = 0; i < 3 && tie; i++)
		{
			for (var j = 0; j < 3; j++)
			{
				if (board[i][j] == "")
				{
					tie = false;
				}
			}
		}
		if (tie)
		{
			return 'n';
		}
	}
	return victor;
}

function declareVictor(board)
{
	var victor = checkForVictory(board);
	var d = document.getElementById("victoryText");
	if (victor != "" && victor != 'n')
	{
		console.log("Victor is " + victor);
		d.innerHTML = "Victor is " + victor;
	}
	else if (victor == 'n')
	{		
		console.log("It's a tie.");
		d.innerHTML = "It's a tie.";
	}
}

//Init canvas and its context
var canvas = document.getElementById("board");
canvas.addEventListener('click', onBoardClick, false);
var context = canvas.getContext("2d");

//Init x and o images
var xImg = new Image();
xImg.src = "x.png";

var oImg = new Image();
oImg.src = "o.png";

//Init board representation
var board = [['','',''],['','',''],['','','']];

//Draw the lines
drawBoard(context, 3);

//Var to hold whose turn it is, either "x" or "o"
var turnPlayer = "x"