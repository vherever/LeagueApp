// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var cons = require('consolidate');
var fs = require('fs');

var LolApi = require('leagueapi');

LolApi.init('f9c94bb0-ab09-4e26-9f82-2fc79b4a2255', 'euw');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '/')));

app.engine('html',cons.underscore);
app.set('view engine', 'html');

var d = {
    summonerBaseInfo: {
        id: null
    },
    summonerSummaryData: {},
    summonerRecentStatistics: {},
    champId: null,
    lastPlayed: '',
    freeChampionsRotation: {}, //runtime
    freeChampionsRotationByName: [],
    summonerLeagueData: [],
    latestVersion: ''
};

    app.get('/', function(req, res) {
        res.render('index', {title: 'League Of Legends Stats Viewer'});
    });

    app.get('/getFreeChampions', function(req, res) {
        LolApi.Static.getVersions(function(err, versions) {
            d.latestVersion = versions[0];
        });


        LolApi.getChampions(true, function(err, champs) {
            d.freeChampionsRotation = champs;
            d.freeChampionsRotationByName = [];
            var i,
                j,
                z = 0;
            for(i = 0; j = d.freeChampionsRotation.length, i < j; i ++) {
                LolApi.Static.getChampionById(d.freeChampionsRotation[i].id).then(function(data) {
                    d.freeChampionsRotationByName.push(data.key);
                    z += 1;
                    if(z>9){
                        res.send({ championsRotation: d.freeChampionsRotationByName, latestVersion: d.latestVersion });
                    }
                });
            }
        });

    });

    app.get('/searching', function (req, res) {
        var val = req.query.search;
        LolApi.Summoner.getByName(val)
            .then(function (summoner) {
                var data = summoner[Object.keys(summoner)[0]];

                d.summonerBaseInfo.id = data.id;
                d.summonerBaseInfo = data;

                LolApi.Stats.getPlayerSummary(d.summonerBaseInfo.id, 'SEASON2016').then(function(playerSummary) {
                    d.summonerSummaryData = playerSummary;
                });

                LolApi.getLeagueData(d.summonerBaseInfo.id).then(function(leagueData) {
                    d.summonerLeagueData = leagueData;
                });

                LolApi.getRecentGames(d.summonerBaseInfo.id, getSummonerInfo);
                function getSummonerInfo(err, summonerRecentStatistics) {
                    if(!err) {
                        d.summonerRecentStatistics = summonerRecentStatistics;

                        // get id of recent played champion
                        d.champId = d.summonerRecentStatistics[0].championId;

                        // get last played champion name based by id
                        LolApi.Static.getChampionById(d.champId).then(function(lastPlayed) {
                            d.lastPlayed = lastPlayed;
                            res.send({ response: d });
                            res.end();
                        });
                    }
                }
            }, function (error) {
                res.send(error);
            });
    });

// run server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});