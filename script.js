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
    self.greenPepperPiece = new Piece(this, "greenPepper", "assets/images/piece_green_pepper.png", "greenpepper_cursor");
    self.pepperoniPiece = new Piece(this, "pepperoni", "assets/images/piece_pepperoni.png", "pepperoni_cursor");
    
    self.resetGame = function(){
        self.playCount = 0;

        self.boardState = [null, null, null, null, null, null, null, null, null];

        $(".game-cell").each(function(){
            $(this).html("");
        });

        $(".win-message").html("");

        self.currentPlayer.removeCursors;

        self.currentPlayer.setCursor();

        $(".new-game-box").hide();
    };
    
    self.init = function(){

        var chosenPiece = null;

        $(".new-game-box").hide();
        $(".player-container").hide();

        $(".overlay").show();
        $(".form-container").show();


        $("input[name=topping]").change(function(){
                if($(this).is(':checked')){

                    var value = $(this).val();

                        $(".radio-img").removeClass("selected-img");
                        $('#'+value).addClass("selected-img");
                }
            });

            $("#submit").click(function(){

                var checkedVal = $("input[name=topping]:checked").val();

                if(!self.player1){

                    if(!checkedVal){
                        $(".warning").text("Please select a piece.");

                        return false;
                    }

                    chosenPiece = $("input[name=topping]:checked").val();

                    self.player1 = self.createPlayerFromFormValues("Player 1", $("#player1-info"));

                    $("#formTitle").text("Player 2");

                    self.resetForm();

                } else {

                    if(!checkedVal){
                        $(".warning").text("Please select a piece.");

                        return false;
                    }

                    if($("input[name=topping]:checked").val() === chosenPiece){
                        $(".warning").text("Please select a different piece.");
                        return false;
                    }

                    self.player2 = self.createPlayerFromFormValues("Player 2", $("#player2-info"));

                    self.currentPlayer = self.player1;
                    //set cursor initially with player 1
                    self.currentPlayer.setCursor();
                    
                    $(".overlay").hide();
                    $(".form-container").hide();
                    $(".player-container").show();

                }

            });


        $(".game-cell").on("click",function() {

            self.handleBoardClick($(this));
        });

        $(".new-game-box").on("click", function(){

            self.resetGame();
            self.canClick = true;
        });
        
    };

    self.createPlayerFromFormValues = function(defaultName, playerInfoBox){

            var name = $("#name").val() ? $("#name").val() : defaultName;

            var pieceStr = $("input[name=topping]:checked").val();

            var pieceConcat = pieceStr + "Piece";

            var piece = self[pieceConcat];

            var player = new Player(this, name, piece, playerInfoBox);

            player.createBoard();

            return player;

    };

    self.resetForm = function(){
        $("#name").val("");
        $("input:radio").attr("checked", false);
        $(".radio-img").removeClass("selected-img");
        $(".warning").text("");
    };

    
    self.initPlayer = function(assignment, name, piece, playerInfoBox){
            
            assignment = new Player(this, name, piece, playerInfoBox);

            return assignment;
    };
    
    self.handleBoardClick = function(element){


        if (self.canClick === true) {

            var $element = $(element);
            var elId = $element.attr("id");
            var boardId = elId.substr(elId.length-1, elId.length);

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

function Player(parent, name, piece, playerBoard){
    this.parent = parent;
    this.name = name;
    this.piece = piece;
    this.playerBoard = playerBoard;
    this.wins = 0;


    this.createBoard = function(){
        this.playerBoard.find(".player-name").text(this.name);
        console.log("this piece:", this.piece);
        this.playerBoard.find(".piece").html("<img src='"+this.piece.image+"'>");

        return this.playerBoard;
    };
    
    this.checkWin = function(){

        var playerArray = [];

        for(var i=0; i < this.parent.boardState.length; i++){
            //loop through gameState array for existing img srcs
            if(this.parent.boardState[i] === this.piece.image){
                // if there is a src match push that index to playerArray
                playerArray.push(i);
            }
        }

        for (i = 0; i < this.parent.winArray.length; i++) {

            var isWinner = true;

            for (var j = 0; j < this.parent.winArray[i].length; j++) {
                //check each item in subArrays of winArray
                if(playerArray.indexOf(this.parent.winArray[i][j])=== -1){
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
                this.wins++;
                this.playerBoard.find(".wins").text(this.wins);
                $h2WinMessage.addClass("rainbow");
                $(".win-message").append($h2WinMessage);
                $(".new-game-box").show();
            }
        }
        if(this.parent.playCount === 9 && isWinner === false){//if all cells have been filled and there's no winner, it's a tie

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
        //remove all
        this.removeCursors();
        
        //add player's cursor
        $("#game-board").addClass(this.piece.cursor);
    };
    
}

$(document).ready(function(){
    
    createBounce();
    
    var game = new Game;

    game.init();
    
});
