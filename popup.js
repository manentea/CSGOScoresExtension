var Match = function(string){
  var self = this;
  self.string = string;
  self.team1 = string.split(/\d/)[0].trim();
  self.team2 = string.split(/\d/)[1].trim();
  self.event = string.split('Event')[1].split('Maps')[0];
}

var News = function(object){
  var self = this;
  self.title = object.title;
  self.href = object.href;
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

var callback2 = function(response){
    var actualJSON = JSON.parse(response);
    for(var i = 0; i < actualJSON.length; i++){
        var newsItem = new News(actualJSON[i]);
        news.push(newsItem)
    }
    populatePage2();
};

function populatePage(){
    var div = document.getElementById('matches');
    for(var i = 0; i < matches.length; i++){
        var child = document.createElement('div');
        child.className = 'match';
        child.innerHTML = "<p>" + matches[i].team1 + ': ' + matches[i].score1 + '</p>' + '<p>' + matches[i].team2 + ': ' + matches[i].score2 + '</p><p>'+ matches[i].event + '</p>';
        div.appendChild(child);
    }
}

function populatePage2(){
    var div = document.getElementById('newsList');
    for(var i = 0; i < news.length; i++){
        var child = document.createElement('div');
        child.className = 'item';
        child.innerHTML = "<p><a class='link' href=" + news[i].href + '>' + news[i].title.trim() + '</a></p>';
        div.appendChild(child);
    }
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'https://raw.githubusercontent.com/manentea/TTT/master/index.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}

function loadJSON2(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'https://raw.githubusercontent.com/manentea/TTT/master/news.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback2(xobj.responseText);
          }
    };
    xobj.send(null);
}


document.getElementById('news').addEventListener('click', function(e){
    e.preventDefault();
    document.getElementById('matches').classList.toggle('none');
    document.getElementById('newsList').classList.toggle('none');
});
document.getElementById('crown').addEventListener('click', function(e){
    e.preventDefault();
    document.getElementById('newsList').classList.toggle('none');
    document.getElementById('matches').classList.toggle('none');
    linkTabs();

});

window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
});

matches = [];
news = [];
loadJSON(callback);
populatePage();
loadJSON2(callback);
populatePage2();