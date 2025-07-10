const TictactoeGame = (function () {
    let gameboard = [['','',''],['','',''],['','','']];
    let done = false;
    let tie = false;
    let alreadyClick = false;

    const resetBoard = () => {
        done = false;
        tie = false;
        gameboard = [['','',''],['','',''],['','','']];
    };

    const resetAlreadyClick = () => { alreadyClick = false };
    
    const game = (player, boardCoordinates) => {
        if (gameboard[boardCoordinates.x][boardCoordinates.y] == '') {
            gameboard[boardCoordinates.x][boardCoordinates.y] = player;
        } else {
            console.log(`hey, stop that!`);
            alreadyClick = true;
        }

        if (checkForWin(player)) {
            console.log(`${player} wins!`);
            done = true;
        } else if (checkForTie()) {
            console.log('It was a tie!');
            tie = true;
        }

        return { gameboard: gameboard, done: done, tie: tie, alreadyClick: alreadyClick };
    };

    const checkForWin = (player) => {
        const cellIsPlayer = (currentValue) => currentValue == player;
        
        // Check each row
        for (let row of gameboard) {
            if (row.every(cellIsPlayer)) {
                
                return true;
            }
        }

        // Check each column
        for (let i = 0; i <= 2; i++) {
            if (gameboard.map(y => y[i]).every(cellIsPlayer)) {
                
                return true;
            }
        }

        // Check each 3x3 diagonal
        let diagonals = [
            [gameboard.flat()[0], gameboard.flat()[4], gameboard.flat()[8]], 
            [gameboard.flat()[6], gameboard.flat()[4], gameboard.flat()[2]]
        ];
        for (let diagonal of diagonals) {
            if (diagonal.every(cellIsPlayer)) {
                
                return true;
            }
        }
    };

    const checkForTie = () => {
        const cellNotBlank = (currentValue) => currentValue != '';

        if (gameboard.flat().every(cellNotBlank)) {
            
            return true;
        }
    };

    return { game: game, resetBoard: resetBoard, resetAlreadyClick: resetAlreadyClick };
})();

const TictactoeBoard = (function () {
    const setupGame = () => {
        const gameElementArray = ['grid1','grid2','grid3','grid4','grid5','grid6','grid7','grid8','grid9'];
        const gameCoordArray = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
        
        let turn = 1;
        let player = 'X';

        let playerXScore = 0;
        let playerOScore = 0;
        let playerXName;
        let playerOName;

        const gameContainer = document.getElementById('gridContainer');
        
        gameElementArray.forEach((value) => {
            const grid = document.createElement('div');
            grid.id = value;
            grid.classList.add('grid');
            gameContainer.appendChild(grid);
        });

        const dialog = document.getElementById('dialog');
        const confirmButton = document.getElementById('confirmBtn');

        confirmButton.addEventListener("click", (e) => {
            e.preventDefault();

            playerXName = document.getElementById('playerXName').value;
            playerOName = document.getElementById('playerOName').value;
            dialog.close();
        });

        dialog.showModal();

        const doneModal = document.getElementById('dialogDone');
        const textContainer = document.getElementById('win');
        const moreTextContainer = document.getElementById('players');
        const confirmBtn = document.getElementById('confirmBtnDone');
        confirmBtn.addEventListener("click", () => { 
            gameElementArray.forEach((value) => { document.getElementById(value).textContent = '' });
            doneModal.close(); 
        });

        for (let i = 0; i <= 8; i++) {
            const element = document.getElementById(gameElementArray[i]);
            element.addEventListener("click", () => {
                console.log(`${player} clicked ${gameCoordArray[i][0]} ${gameCoordArray[i][1]}`);
                let gameObject = TictactoeGame.game(player, {x: gameCoordArray[i][0], y: gameCoordArray[i][1]});

                if (gameObject.alreadyClick == true) {
                    TictactoeGame.resetAlreadyClick();

                    return;
                }

                const clickedElement = document.getElementById(gameElementArray[i]);
                clickedElement.textContent = player;

                if (gameObject.done == true) {
                    if (player == 'X') {
                        playerXScore++;
                    } else {
                        playerOScore++;
                    }
                    
                    textContainer.textContent = `${player} wins!`;
                    let literal = moreTextContainer.textContent = `${playerXName}'s score: ${playerXScore}<br>${playerOName}'s score: ${playerOScore}`;
                    moreTextContainer.innerHTML = literal;

                    doneModal.showModal();

                    turn = 1;
                    player = 'X';
                               
                    TictactoeGame.resetBoard();
                    
                    return;
                } else if (gameObject.tie == true) {
                    textContainer.textContent = `Its a tie!`;
                    let literal = moreTextContainer.textContent = `${playerXName}'s score: ${playerXScore}<br>${playerOName}'s score: ${playerOScore}`;
                    moreTextContainer.innerHTML = literal;
                   
                    doneModal.showModal();

                    turn = 1;
                    player = 'X';

                    TictactoeGame.resetBoard();
                    
                    return;
                }

                turn++;
                if (turn % 2 === 0) {
                    player = 'O';
                } else {
                    player = 'X';
                }
            });
        }
    };

    return { setupGame };
})();

TictactoeBoard.setupGame();