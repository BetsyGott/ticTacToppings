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

    self.initGameState = function(){
        var initialGameState = localStorage.getItem("gameState");

        if(!initialGameState){
            initialGameState = {
                boardState: [null, null, null, null, null, null, null, null, null],
                player1: self.player1,
                player2: self.player2,
                currentPlayer: self.player1
            };
        } else{
            initialGameState = JSON.parse(initialGameState);
        }

        console.log("initial game state: ", initialGameState);
        return initialGameState;
    };
    
    self.gameState = self.initGameState();

    self.player1 = self.gameState.player1 ? new Player(self.gameState.player1.name, self.gameState.player1.piece, self.gameState.player1.piece.cursor) : null;
    self.player2 = self.gameState.player2 ? new Player(self.gameState.player2.name, self.gameState.player2.piece, self.gameState.player2.piece.cursor) : null;
    
    self.mushroomPiece = new Piece("mushroom", "assets/images/piece_mushroom.png", "mushroom_cursor");
    self.pepperPiece = new Piece("greenPepper", "assets/images/piece_green_pepper.png", "greenpepper_cursor");
    self.pepperoniPiece = new Piece("pepperoni", "assets/images/piece_pepperoni.png", "pepperoni_cursor");
    
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

    self.assignParent = function(){
       self.player1.parent = self;
        self.player2.parent = self;
    };
    
    self.init = function(){
        //TODO check if player1 and player2 are null and run the thing where they choose their piece and name if so
        
        //populates the board with localStorage saved values if there are any
        $(".game-cell").each(function(){
            self.initBoard($(this));
        });
        
        while(!self.player2) {
            self.initPlayers();
        }

        while(!self.player2.parent){
            self.assignParent();
        }

        //hide reset game button by default
        $("#game-reset").hide();
        
        //check whether anyone has won (requires initializing players right away)

        self.player1.checkWin();
        self.player2.checkWin();

        //set cursor initially with player 1 
        self.player1.setCursor();

        $(".game-cell").on("click",function() {
            
            self.handleBoardClick($(this));
        });

        $("#game-reset").on("click", function(){

            self.resetGame();
            self.canClick = true;
        });
        
    };
    
    self.initBoard = function(element){
      var $element = $(element);
        
        var $id = $element.attr("id");
        var index = $id[$id.length-1];

        if(self.gameState.boardState[index]){
            var $img = $("<img>").attr("src", self.gameState.boardState[index]);
            $element.html($img);
        }
    };
    
    self.initPlayers = function(){
        //TODO this currently sets a default name and piece. change so players choose their name and piece
        if(!self.player1){

            self.player1 = new Player(this, "Player 1", self.mushroomPiece);

            self.gameState.player1 = self.player1;
            self.gameState.currentPlayer = self.gameState.player1;

        } else if(self.player1 && !self.player2){
            
            self.player2 = new Player(this, "Player 2", self.pepperPiece);

            self.gameState.player2 = self.player2;
        }

    };
    
    self.handleBoardClick = function(element){
        if (self.canClick === true) {

            var $element = $(element);

            var $id = $element.attr("id");

            var index = $id[$id.length-1];

            if(!self.gameState.boardState[index]) {
                //if the html is empty
                // create an image element with a src equal to current player's piece image

                self.gameState.boardState[index] = self.gameState.currentPlayer.piece.image;

                var $img = $("<img>").attr("src", self.gameState.boardState[index]);
                
                $element.html($img);
               
                self.playCount++;

                self.gameState.currentPlayer.checkWin();
                // switch player to other player
                if(self.gameState.currentPlayer.name === self.player1.name){
                    self.gameState.currentPlayer = self.player2;
                    self.gameState.currentPlayer.setCursor();
                }else {
                    self.gameState.currentPlayer = self.player1;
                    self.gameState.currentPlayer.setCursor();
                }

                console.log("gamestate immediately before setting to localStorage", self.gameState);
                localStorage.setItem("gameState", JSON.stringify(JSON.decycle(self.gameState)));

            }
        }
    }
    
}

function Piece(name, image, cursor){
    this.name = name;
    this.image = image;
    this.cursor = cursor;
}

function Player(name, piece){
    this.parent = null;
    this.name = name;
    this.piece = piece;
}

Player.prototype.checkWin = function(){
    console.log("check win: who am i?", this);
    console.log("check win: who is my parent?", this.parent);
    console.log("check win: this piece: ", this.piece);

    var playerArray = [];
    for(var i=0; i < this.parent.gameState.boardState.length; i++){
        //loop through gameState array for existing img srcs

        if(this.parent.gameState.boardState[i] === this.piece.image){
            // if there is a src match push that index to playerArray
            playerArray.push(i);
        }
    }
    for (i = 0; i < this.parent.winArray.length; i++) {
        //enter into each item in winArray
        var isWinner = true;
        //isWinner will be set to false whenever a subArray does not meet win condition
        for (var j = 0; j < this.parent.winArray[i].length; j++) {
            //check each item in subArrays of winArray
            if(playerArray.indexOf(this.parent.winArray[i][j])===-1){
                //if subArray[j] is not in playerArray, not a winner
                isWinner = false;
                break;
            }
        }
        //check if isWinner is true, if so, there was a win condition, current player wins
        if(isWinner === true){
            this.parent.canClick = false;
            var $h3WinMessage = $("<h3>"+ this.name + " wins!" + "</h3>");
            $("#player-board").append($h3WinMessage);
            $("#game-reset").show();
        }
    }
    if(this.parent.playCount === 9 && isWinner === false){
        //if all cells have been filled and there's no winner, it's a tie
        this.parent.canClick = false;
        var $h3TieMessage = $("<h3>" + "game is a tie." + "</h3>");
        $("#player-board").append($h3TieMessage);
        $("#game-reset").show();
    }
};

Player.prototype.setCursor = function(){
    //remove all classes
    $("#game-board").removeClass("mushroom_cursor");
    $("#game-board").removeClass("greenpepper_cursor");
    $("#game-board").removeClass("pepperoni_cursor");

    //add player's cursor
    $("#game-board").addClass(this.piece.cursor);
};

$(document).ready(function(){
    
    var game = new Game;
    
    //run game init function
    game.init();
    
});
