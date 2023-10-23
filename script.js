"use strict";

const Player = (gamePiece) => {
    this.gamePiece = gamePiece;

    const getGamePiece = () => {
        return gamePiece;
    };

    return { getGamePiece };
};

/* 
** The GameBoard represents the state of the tic tac toe board.
** Each space on the board holds a Cell. The getCell method is used to select the Cell, and the setCell method is used to add gamePiece to the Cell.
*/

const gameBoard = (() => {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board[i] = "";
    };

    const setCell = (index, gamePiece) => {
        if (index > board.length) return;
        board[index] = gamePiece;
    };

    const getCell = (index) => {
        if (index > board.length) return;
        return board[index];
    };

    return { setCell, getCell };

})();

/* 
** The GameController controls the flow and state of the game, including turns and winning conditions.
*/

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (cellIndex) => {
        gameBoard.setCell(cellIndex, getCurrentPlayer());
        if (checkWinner(cellIndex)) {
            screenController.setResultMessage(getCurrentPlayer());
            isOver = true;
            return;
        }
        if (round === 9) {
            screenController.setResultMessage("Draw");
            isOver = true;
            return;
        }
        round++;
        screenController.setMessageElement(`Player ${getCurrentPlayer()}'s turn`);
    };

    const getCurrentPlayer = () => {
        return round % 2 === 1 ? playerX.getGamePiece() : playerO.getGamePiece();
    };

    const checkWinner = (cellIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4 ,7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions
            .filter((combo) => combo.includes(cellIndex))
            .some((possibleCombo) => 
                possibleCombo.every(
                    (index) => gameBoard.getCell(index) === getCurrentPlayer()
                )
            );
    };

    const getIsOver = () => {
        return isOver;
    };

    return { playRound, getIsOver }
})();

/*
** The ScreenController is the visual representation of the game. Players are interacting with the game through the DOM, so DOM references to the game board and player turn display are created here.
*/

const screenController = (() => {
    const cellElements = document.querySelectorAll(".cell");
    const messageElement = document.querySelector(".message");
    
    cellElements.forEach((cell) => 
        cell.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameBoard();
        })
    );

    const updateGameBoard = () => {
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].textContent = gameBoard.getCell(i);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`Player ${winner} is the winner!`);
        }
    };

    return { setMessageElement, setResultMessage };
})();