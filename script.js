function Game(){
    var self = this;
    self.canClick = true;
    self.playCount = 0;
    self.winArray = [
        [0,1,2],
        [3, 4, 5],
        [6, 7, 8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    
    self.gameState = self.initGameState();

    //these need to be set to the gameState object initially
    self.player1 = null;
    self.player2 = null;
    
    self.mushroomPiece = new Piece(this, "mushroom", "assets/images/piece_mushroom.png", "mushroom_cursor");
    self.pepperPiece = new Piece(this, "greenPepper", "assets/images/piece_green_pepper.png", "greenpepper_cursor");
    self.pepperoniPiece = new Piece(this, "pepperoni", "assets/images/piece_pepperoni.png", "pepperoni_cursor");
    
    self.resetGame = function(){
        self.playCount = 0;
        //remove localStorage item
        localStorage.removeItem("gameState");

        self.gameState.boardState = [null, null, null, null, null, null, null, null, null];

        $(".game-cell").each(function(){
            $(this).html("");
        });

        $("#player-board").find("h3").remove();

        $("#game-board").removeClass("pepperoni_cursor");
        $("#game-board").removeClass("mushroom_cursor");
        $("#game-board").removeClass("greenpepper_cursor");

        self.gameState.currentPlayer.setCursor();

        $("#game-reset").hide();
    };
    
    self.initGameState = function(){
        var initialGameState = localStorage.getItem("gameState");

        if(initialGameState){
            initialGameState = {
                boardState: [null, null, null, null, null, null, null, null, null],
                currentPlayer: self.player1
            };
        } else{
            initialGameState = JSON.parse(initialGameState);
        }
        
        return initialGameState;
    };
    
}

function Piece(parent, name, image, cursor){
    this.parent = parent;
    this.name = name;
    this.image = image;
    this.cursor = cursor;
}

function Player(parent, name, piece){
    this.parent = parent;
    this.name = name;
    this.piece = piece;
    
    this.checkWin = function(){
        var playerArray = [];
        for(var i=0; i < parent.gameState.boardState.length; i++){
            //loop through gameState array for existing img srcs
            if(parent.gameState.boardState[i] === this.piece.image){
                // if there is a src match push that index to playerArray
                playerArray.push(i);
            }
        }
        for (i = 0; i < parent.winArray.length; i++) {
            //enter into each item in winArray
            var isWinner = true;
            //isWinner will be set to false whenever a subArray does not meet win condition
            for (var j = 0; j < parent.winArray[i].length; j++) {
                //check each item in subArrays of winArray
                if(playerArray.indexOf(parent.winArray[i][j])===-1){
                    //if subArray[j] is not in playerArray, not a winner
                    isWinner = false;
                    break;
                }
            }
            //check if isWinner is true, if so, there was a win condition, current player wins
            if(isWinner === true){
                parent.canClick = false;
                var $h3WinMessage = $("<h3>"+ this.name + " wins!" + "</h3>");
                $("#player-board").append($h3WinMessage);
                $("#game-reset").show();
            }
        }
        if(parent.playCount === 9 && isWinner === false){
            //if all cells have been filled and there's no winner, it's a tie
            parent.canClick = false;
            var $h3TieMessage = $("<h3>" + "game is a tie." + "</h3>");
            $("#player-board").append($h3TieMessage);
            $("#game-reset").show();
        }
    };
    
    this.setCursor = function(){
        //remove all classes
        $("#game-board").removeClass("mushroom_cursor");
        $("#game-board").removeClass("greenpepper_cursor");
        $("#game-board").removeClass("pepperoni_cursor");
        
        //add player's cursor
        $("#game-board").addClass(this.piece.cursor);
    };
    
}

$(document).ready(function(){

    //populates the board with localStorage saved values if there are any
    $(".game-cell").each(function(){
        //get ID of cell div
        var $id = $(this).attr("id");
        var index = $id[$id.length-1];

        if(gameState.boardState[index]){
            var $img = $("<img>").attr("src", gameState.boardState[index]);
            $(this).html($img);
        }
    });

    //hide reset game button by default
    $("#game-reset").hide();
    checkWin(player1);
    checkWin(player2);

    //set cursor initially, with player 1 for now
    setCursor(player1);

    //run function to assign piece objects to player objects (run again on new game button click
    $(".game-cell").on("click",function() {
        if (canClick === true) {

        var $this = $(this);

        var $id = $this.attr("id");

        var index = $id[$id.length-1];

        if(!gameState.boardState[index]) {
            console.log(gameState.currentPlayer.piece.image);
            //if the html is empty
            // create an image element with a src equal to current player's piece image

            gameState.boardState[index] = gameState.currentPlayer.piece.image;

            var $img = $("<img>").attr("src", gameState.boardState[index]);

            //insert it into the cell clicked on
            $this.html($img);
            //update play count
            playCount++;
            // check for win
            checkWin(gameState.currentPlayer);
            // switch player to other player
            if(gameState.currentPlayer.name === player1.name){
                gameState.currentPlayer = player2;
                setCursor(gameState.currentPlayer);
            }else {
                gameState.currentPlayer = player1;
                setCursor(gameState.currentPlayer);
            }
            localStorage.setItem("gameState", JSON.stringify(gameState));
            console.log(localStorage.getItem("gameState"));
        }
    }
    });

    //click handler for reset button
    $("#game-reset").on("click",function(){

        resetGame();
        canClick = true;
    });
});

// TODO pizza game board set to right side of container right now, change to middle after player piece selection and board disappears