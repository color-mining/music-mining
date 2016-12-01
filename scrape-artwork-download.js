var vo = require('vo');
var fs = require('fs');
var https = require('https');
var Canvas = require('canvas');
var ColorThief = require('color-thief');
var i = 0;

var chartsSpotify = require('./results/output-spotify.json');



function getArtwork(){
  var chartItem = chartsSpotify[i];

  var colorThief = new ColorThief();

  if(chartItem.spotify){
    var id = chartItem.spotify.id;

    console.log('GET -> ', id);

      https.get(chartItem.spotify.images[chartItem.spotify.images.length-1].url, function(data){

        var fileDest = './results/img/'+ id +".jpg";
        var file = fs.createWriteStream(fileDest);
        data.pipe(file);


        file.on('finish', function(){

          var image = fs.readFileSync('./results/img/'+ id +'.jpg');
          var colors = colorThief.getPalette(image, 10);
          console.log(colors);
          chartsSpotify[i].colors = colors;

          step(chartsSpotify);

        });//on.finish
      });//http.get
  }
  else {
    step(chartsSpotify);
  }
}



function step(data){
  i++;
  if(i < chartsSpotify.length){
      getArtwork();
  }
  else {
  data = JSON.stringify(data, null, 2);
  fs.writeFile('results/output-spotify-colors.json', data, 'utf8');
  }
}

getArtwork();
