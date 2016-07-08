function createBounce() {

    var
        myText = $(".bounce-text").html(),
        wrapText = "";

    for (var i = 0; i < myText.length; i++) {
        wrapText += "<em>" + myText.charAt(i) + "</em>";
    }

    $(".bounce-text").html(wrapText);

var
    myLetters = $(".bounce-text em");
    var j = 0;
    
function applyBounce() {
    setTimeout(function() {
        myLetters[j].className = "bounce-me";
        j++;

        if (j < myLetters.length) {
            applyBounce();
        }
    }, 150);
}

applyBounce();
}