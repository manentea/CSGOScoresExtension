  // var Xray = require("x-ray");
  // var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var Match = function(link, team1, team2, score, map){
  var self = this;
  self.link = link;
  self.team1 = team1;
  self.team2 = team2;
  self.score = score;
  self.map = map
}

var MatchLink = function(title, href, date){
  var self = this;

  self.title = title;
  self.href = 'http://' + href;
  self.date = date.toLocaleDateString() + '<br>' + date.toLocaleTimeString();
}

var News = function(title, href, date){
  var self = this;
  self.title = title;
  self.href = 'http://' + href;
  self.date = date.toLocaleDateString() + '<br>' + date.toLocaleTimeString();
}

var Link = function(object){
  var self = this;
  self.title = object.title;
  self.href = 'http://' + object.href;
}

var newsCallback = function(response){
    var newsFeed = $(response);

    newsFeed.find("item").each(function(){
      var title = $(this).find("title").text();
      var date = new Date($(this).find("pubDate").text());
      var href = $(this).text().split('http://')[1].split(' ')[0];
      news.push(new News(title, href, date));
    });
    populateNewsPage();
}

var upcomingCallback = function(response){
  var upcomingFeed = $(response);

  upcomingFeed.find("item").each(function(){
    var title = $(this).find("title").text();
    var date = new Date($(this).find("pubDate").text());
    var href = $(this).text().split('http://')[1].split(' ')[0];
    matchLinks.push(new MatchLink(title, href, date));
  });
  populateUpcoming();
};

function populateNewsPage(){
    var div = $("#newsList");
    for(var i = 0; i < news.length; i++){
        var child = document.createElement('div');
        child.className = 'item';
        child.innerHTML = "<p><a class='link' href=" + news[i].href + '' + ">" + news[i].title.trim() + "</a></p><p class='link'>" + news[i].date + '</p>';
        div.append(child);
    }
}

function populateUpcoming(){
    var div = $('#upcoming');
    for(var i = 0; i < matchLinks.length; i++){
        var child = document.createElement('div');
        child.className = 'item';
        child.innerHTML = "<p><a class='link' href=" + matchLinks[i].href + '>' +'<p>' + matchLinks[i].title + '</p><p>' + matchLinks[i].date + '</p></a></p>';
        div.append(child);
    }
}

function populateResults(matches){
  var div = $('#matches');
  for(var i = 0; i < matches.length; i++){
    var child = document.createElement('div');
    child.className = 'item';
    child.innerHTML = '<a class="link" href="http://hltv.org' + matches[i].link + '"><p style="text-transform:capitalize;">' + matches[i].map + '</p><p>' + matches[i].team1 + ' <span class="matchScore">' + matches[i].score + '</span> '  + matches[i].team2 + '</p></a>';
    div.append(child);
  }
  colorScore();
}

function loadResults(){
  var maps;
  var firstTeam;
  var secondTeam;
  var scores;
  var links;
  $.ajax({
    url: 'http://cors.io/?u=http://www.hltv.org/results/',
    method: 'get',
    crossDomain: true
  }).done(function(response){

    var searchParams = ['div.matchTimeCell', 'div.matchTeam1Cell',
    'div.matchTeam2Cell', 'div.matchScoreCell'];

    var results = [maps, firstTeam, secondTeam, scores];

    for(var i = 0; i < results.length; i++){
      results[i] = $(response).find(searchParams[i]).map(function(){
       return $(this).text().trim().replace(/\s+/, " ");
      });
    }

    links = $(response).find("div.matchActionCell").map(function(){
      return $($(this).children()[0]).attr('href');
    });

    results.push(links);

    matches = [];
    for(var i = 0; i < links.length; i++){
      matches.push(new Match(results[4][i], results[1][i], results[2][i], results[3][i], results[0][i]));
    }

    populateResults(matches);
  }).fail(function(error){
    console.log('nope');
    console.log(error);
  });
}

function loadNews(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'http://www.hltv.org/news.rss.php', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            newsCallback(xobj.responseText);
          }
    };
    xobj.send(null);
}

function upcomingMatches(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'http://www.hltv.org/hltv.rss.php', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            upcomingCallback(xobj.responseText);
          }
    };
    xobj.send(null);
}

function colorScore(){
  $('.matchScore').each(function(){
    var nums = $(this).text().split(' - ');
    console.log(nums);
    if(parseInt(nums[0]) > parseInt(nums[1])){
      var replace = '<span style="font-weight:bold;>"<span class="green"> ' + nums[0] + ' </span> - <span class="red"> ' + nums[1] + '</span></span>';
    }else{
      var replace = '<span style="font-weight:bold;>"<span class="red"> ' + nums[0] + ' </span> - <span class="green"> ' + nums[1] + '</span></span>';
    }
    $(this).html(replace);
  })
}


$(document).ready(function(){
  news = [];
  links = [];
  matchLinks = [];
  loadNews(newsCallback);
  populateNewsPage();
  upcomingMatches(upcomingCallback);
  populateUpcoming();
  loadResults();
  $("#calendar").on('click', function(event){
    $("#upcoming").toggle(true);
    $("#matches").toggle(false);
    $("#newsList").toggle(false);
  });
  $("#crown").on('click', function(event){
    $("#upcoming").toggle(false);
    $("#matches").toggle(true);
    $("#newsList").toggle(false);
  });
  $("#news").on('click', function(event){
    $("#upcoming").toggle(false);
    $("#matches").toggle(false);
    $("#newsList").toggle(true);
  })
  $('body').on('click', 'a', function(){
    if($(this).attr('href') !== undefined)
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
  });
});
