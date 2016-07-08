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

        self.currentPlayer.setCursor();

        $(".new-game-box").hide();
    };
    
    self.init = function(){

        $(".new-game-box").hide();

        $(".player-container").hide();
        //TODO check if player1 and player2 are null and run the thing where they choose their piece and name if so

        $(".overlay").show();
        $(".form-container").show();


        $("input[name=topping]").change(function(){
                if($(this).is(':checked')){

                    console.log("checked: ", $(this).val());
                    var value = $(this).val();
                    console.log("value: ", value);

                        $(".radio-img").removeClass("selected-img");
                        $('#'+value).addClass("selected-img");



                }
            });

            $("#submit").click(function(){

                if(!self.player1){

                    self.player1 = self.createPlayerFromFormValues("Player 1", "mushroom", $("#player1-info"));

                    $("#formTitle").text("Player 2");

                    $("#name").val("");
                    $("input:radio").attr("checked", false);
                    $(".radio-img").removeClass("selected-img");


                } else {
                    self.player2 = self.createPlayerFromFormValues("Player 2", "pepperoni", $("#player2-info"));


                    self.currentPlayer = self.player1;
                    //set cursor initially with player 1
                    self.currentPlayer.setCursor();
                    
                    $(".overlay").hide();
                    $(".form-container").hide();
                    $(".player-container").show();

                    console.log("player2: ", self.player2);
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

    self.createPlayerFromFormValues = function(defaultName, defaultPiece, playerInfoBox){

            var name = $("#name").val() ? $("#name").val() : defaultName;

            var pieceStr = $("input[name=topping]:checked").val() ? $("input[name=topping]:checked").val() : defaultPiece;

            var pieceConcat = pieceStr + "Piece";

            var piece = self[pieceConcat];

            var player = new Player(this, name, piece, playerInfoBox);

            return player;

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

function Player(parent, name, piece, playerBoard){
    var playerObj = this;
    this.parent = parent;
    this.name = name;
    this.piece = piece;
    this.playerBoard = playerBoard;
    this.wins = 0;
    
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
                this.wins++;
                this.playerBoard.find(".wins").text(this.wins);
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
