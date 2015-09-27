// XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var Match = function(string){
  var self = this;
  self.string = string;
  self.team1 = string.split(/\d/)[0].trim();
  self.team2 = string.split(/\d/)[1].trim();
  self.event = string.split('Event')[1].split('Maps')[0];
}

Match.prototype.score1func = function(){
    for(var i = 0; i < this.string.split(/\D/).length; i++){
        if(this.string.split(/\D/)[i] != ''){
            this.score1 = this.string.split(/\D/)[i];
            return;
        }
    }
}

Match.prototype.score2func = function(){
    var count = 0;
    for(var i = 0; i < this.string.split(/\D/).length; i++){
        if(this.string.split(/\D/)[i] != '' && count === 1){
            this.score2 = this.string.split(/\D/)[i];
            return;
        }else if(this.string.split(/\D/)[i] != ''){
            count++;
        }
    }
}

var callback = function(response){
    var actualJSON = JSON.parse(response);
    for(var i = 0; i < actualJSON.length; i++){
        var match = new Match(actualJSON[i].a);
        match.score1func();
        match.score2func();
        matches.push(match);
    }
    matches[0].score1func();
    matches[0].score2func();
    console.log(matches[0].score1 + ' ' + matches[0].score2);
    populatePage();
};

function populatePage(){
    var div = document.getElementById('matches');
    for(var i = 0; i < matches.length; i++){
        var child = document.createElement('div');
        child.className = 'match';
        child.innerHTML = "<p>" + matches[i].team1 + ': ' + matches[i].score1 + '</p>' + '<p>' + matches[i].team2 + ': ' + matches[i].score2 + '</p><p>'+ matches[i].event + '</p>';
        div.appendChild(child);
        // $('#matches').append("<div class='match'> <p>" + matches[i].team1 + ': ' + matches[i].score1 + '</p>' + '<p>' + matches[i].team2 + ': ' + matches[i].score2 + '</p><p>'+ matches[i].event + '</p></div>');
    }
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'https://raw.githubusercontent.com/manentea/TTT/master/index.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}

// $(document).ready(function(){
//     matches = [];
//     loadJSON(callback);
// });
matches = [];
loadJSON(callback);
populatePage();