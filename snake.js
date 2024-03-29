var gameOver = false;
		var canvas = document.getElementById('snakeCanvas');
		var ctx = canvas.getContext('2d');
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		var snakeWidth = 10;
		var directions = {
			up : { x : 0, y : -1, key : 38 },
			down : { x : 0, y : 1, key : 40 },
			left : { x : -1, y : 0, key : 37 },
			right : { x : 1, y : 0, key : 39 }
		};

		var keyboard = [];

		window.onkeydown = function(e){ keyboard[e.which] = true; }
		window.onkeyup = function(e){ keyboard[e.which] = false; }

		var currentDirection = directions.down;

		var Square = function(x, y){
			this.x = x;
			this.y = y;
		}

		var Snake = function(arr){
			this.body = (arr != undefined) ? arr : [];
			this.color = "red";
		}

		var aX = getRandomInt(0, (canvas.height / snakeWidth) - 1);
		var aY = getRandomInt(0, (canvas.height / snakeWidth) - 1);

		var apple = new Square(aX, aY);
		var tailPreviousPosition = new Square(0, 0);

		var snakeArr = [];
		snakeArr.push(new Square(0, 7));snakeArr.push(new Square(0, 6));snakeArr.push(new Square(0, 5));snakeArr.push(new Square(0, 4));
		snakeArr.push(new Square(0, 3));snakeArr.push(new Square(0, 2));snakeArr.push(new Square(0, 1));snakeArr.push(new Square(0, 0));
		var snake = new Snake(snakeArr);



		function drawSnake(snake){
			ctx.fillStyle = "blue";
			for(var i in snake.body){
				var square = snake.body[i];
				ctx.fillRect(square.x * snakeWidth, square.y * snakeWidth, snakeWidth, snakeWidth);
			}
		}		

		function drawApple(apple){
			ctx.fillStyle = "red";
			ctx.fillRect(apple.x * snakeWidth, apple.y * snakeWidth, snakeWidth, snakeWidth);
		}

		function updateSnakePosition(currentDirection){
			for (var i = snake.body.length - 1; i >= 1; i--) {
				snake.body[i].x = snake.body[i-1].x;
				snake.body[i].y = snake.body[i-1].y;
			};
			snake.body[0].x += currentDirection.x;
			snake.body[0].y += currentDirection.y;
		}

		function enlargeSnake(snake, currentDirection){
			var b = snake.body;
			var newTailX = b[b.length - 1].x + (b[b.length - 1].x - b[b.length - 2].x);
			var newTailY = b[b.length - 1].y + (b[b.length - 1].y - b[b.length - 2].y);
			var newTail = new Square(newTailX, newTailY);
			snake.body.push(newTail);
		}

		function isAppleEaten(){
			if (snake.body[0].x == apple.x && snake.body[0].y == apple.y) {
				return true;
			}
			return false;
		}

		function isPlaying(){
			var headX = snake.body[0].x;
			var headY = snake.body[0].y;
			if (headX < 0 || headX >= 60 || headY < 0 || headY >= 60) {
				return false;
			}

			for (var i = 1; i < snake.body.length; i++) {
				if (snake.body[i].x == headX && snake.body[i].y == headY) {
					return false;
				}
			}

			return true;
		}

		function generateNewApple(){
			var isInSnake = false;

			while(true){
				apple.x = getRandomInt(0, (canvas.width / snakeWidth) - 1);
				apple.y = getRandomInt(0, (canvas.height / snakeWidth) - 1);

				for (var i = 1; i < snake.body.length; i++) {
					if (snake.body[i].x == apple.x && snake.body[i].y == apple.y) {
						isInSnake = true;
						break;
					}
				}

				if (isInSnake) {
					isInSnake = false;
				} else {
					return;
				}
			}
		}

		function updateGameLogic(){
			if (!isPlaying()) {
				console.log("game over");
				gameOver = true;
				return;
			};

			if(isAppleEaten()) {
				generateNewApple();
				enlargeSnake(snake, currentDirection);
			}

			if (keyboard[directions.left.key] && currentDirection != directions.right) {
				currentDirection = directions.left;
			} else if (keyboard[directions.right.key] && currentDirection != directions.left) {
				currentDirection = directions.right;
			} else if (keyboard[directions.up.key] && currentDirection != directions.down) {
				currentDirection = directions.up;
			} else if (keyboard[directions.down.key] && currentDirection != directions.up) {
				currentDirection = directions.down;
			};

			updateSnakePosition(currentDirection);
			setTimeout(updateGameLogic, 45);
		}

		function clearCanvas(){
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		function render(){
			console.log("render");
			clearCanvas();
			drawSnake(snake);
			drawApple(apple);

			if (!gameOver) {
				requestAnimationFrame(render);
			} else {
				return;
			}
		}

		function startNewGame(){
			updateGameLogic();
			requestAnimationFrame(render);
		}

		function getRandomInt(min, max) {
		    return min + Math.floor(Math.random() * (max - min + 1));
		}

		startNewGame();