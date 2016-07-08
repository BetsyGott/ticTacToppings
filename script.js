function Game(){
    var self = this;
    self.canClick = true;
    self.playCount = 0;
    self.currentPlayer = null;
    self.boardState = [null, null, null, null, null, null, null, null, null];
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


    //these need to be set to the gameState object initially
    self.player1 = null;
    self.player2 = null;
    
    self.mushroomPiece = new Piece(this, "mushroom", "assets/images/piece_mushroom.png", "mushroom_cursor");
    self.pepperPiece = new Piece(this, "greenPepper", "assets/images/piece_green_pepper.png", "greenpepper_cursor");
    self.pepperoniPiece = new Piece(this, "pepperoni", "assets/images/piece_pepperoni.png", "pepperoni_cursor");
    
    self.resetGame = function(){
        self.playCount = 0;

        self.boardState = [null, null, null, null, null, null, null, null, null];

        $(".game-cell").each(function(){
            $(this).html("");
        });

        //TODO uncomment hiding after testing
        // $(".win-message").hide();
        $(".win-message").html("");

        self.currentPlayer.removeCursors;
        // $("#game-board").removeClass("pepperoni_cursor");
        // $("#game-board").removeClass("mushroom_cursor");
        // $("#game-board").removeClass("greenpepper_cursor");

        self.currentPlayer.setCursor();

        $(".new-game-box").hide();
    };
    
    self.init = function(){
        //TODO check if player1 and player2 are null and run the thing where they choose their piece and name if so

        //run function to have people choose players
        self.initPlayers();

        //hide reset game button by default
        $(".new-game-box").hide();

        self.currentPlayer = self.player1;
        //set cursor initially with player 1 
        self.currentPlayer.setCursor();

        $(".game-cell").on("click",function() {

            self.handleBoardClick($(this));
        });

        $(".new-game-box").on("click", function(){

            self.resetGame();
            self.canClick = true;
        });
        
    };

    
    self.initPlayers = function(){

        //TODO change this so players choose instead of assigning values here
        if(!self.player1){
            
            self.player1 = new Player(this, "Player 1", self.mushroomPiece);

        }

        if(!self.player2){
            
            self.player2 = new Player(this, "Player 2", self.pepperPiece);

        }

    };
    
    self.handleBoardClick = function(element){


        if (self.canClick === true) {

            var $element = $(element);
            var elId = $element.attr("id");
            var boardId = elId.substr(elId.length-1, elId.length);
            console.log("board id: ", boardId);

            if(!self.boardState[boardId]){

                self.boardState[boardId] = self.currentPlayer.piece.image;

                var $img = $("<img>").attr("src", self.currentPlayer.piece.image);

                $element.html($img);

                self.playCount++;
                
                self.currentPlayer.checkWin();

                // switch player to other player
                if(self.currentPlayer === self.player1){

                    self.currentPlayer = self.player2;
                    self.currentPlayer.setCursor();

                }else {
                    self.currentPlayer = self.player1;
                    self.currentPlayer.setCursor();
                }
            }
        }
    }
    
}

function Piece(parent, name, image, cursor){
    this.parent = parent;
    this.name = name;
    this.image = image;
    this.cursor = cursor;
}

function Player(parent, name, piece){
    var playerObj = this;
    this.parent = parent;
    this.name = name;
    this.piece = piece;
    
    this.checkWin = function(){
        console.log("checking win");
        var playerArray = [];

        // $(".game-cell").each(function(){
        //
        //     if($(this).find("img").attr("src") === playerObj.piece.image){
        //         playerArray.push($(this));
        //     }
        //
        // });

        for(var i=0; i < this.parent.boardState.length; i++){
            //loop through gameState array for existing img srcs
            if(this.parent.boardState[i] === this.piece.image){
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
                this.removeCursors();
                var $h2WinMessage = $("<h2>"+ this.name + " wins!" + "</h2>");
                $h2WinMessage.addClass("rainbow");
                $(".win-message").append($h2WinMessage);
                $(".new-game-box").show();
            }
        }
        if(this.parent.playCount === 9 && isWinner === false){
            //if all cells have been filled and there's no winner, it's a tie
            this.parent.canClick = false;
            this.removeCursors();
            var $h2TieMessage = $("<h2>" + "The game is a tie." + "</h2>");
            $h2TieMessage.addClass("rainbow");
            $(".win-message").append($h2TieMessage);
            $(".new-game-box").show();
        }
    };

    this.removeCursors = function() {
        $("#game-board").removeClass("mushroom_cursor");
        $("#game-board").removeClass("greenpepper_cursor");
        $("#game-board").removeClass("pepperoni_cursor");
    };
    
    this.setCursor = function(){
        //remove all classes
        this.removeCursors();
        
        //add player's cursor
        $("#game-board").addClass(this.piece.cursor);
    };
    
}

$(document).ready(function(){
    
    createBounce();
    
    var game = new Game;
    
    //run game init function
    game.init();
    
});
