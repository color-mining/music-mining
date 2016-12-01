var vo = require('vo');
var fs = require('fs');
var SpotifyWebApi = require('spotify-web-api-node');

var charts = require('./results/output.json');
var chartsSpotify = charts;

console.log(charts.length);

vo(run)(function(err, data){
  if(err) throw err;

  data = JSON.stringify(data, null, 2);
  resultDir = './results';

  if(!fs.existsSync(resultDir)){
      fs.mkdirSync(resultsDir);
  }

  fs.writeFile('results/output-spotify.json', data, 'utf8');
});

function * run(){
    var spotifyApi = new SpotifyWebApi();

    for(i = 0; i < charts.length; i++){
      var chartItem = charts[i];

      q = 'artist:\"' + chartItem.artist + '\" '
        + 'album:\"'  + chartItem.title  + '\" '
        + 'year:'+ (chartItem.year - 5) + '-' + chartItem.year;

      console.log('--------------------------------------------');
      console.log('QUERY =',q);

      yield spotifyApi.searchAlbums(q, {limit: 5, market: 'DE'})
        .then(function(data){
          console.log('COUNT = ', data.body.albums.items.length);

          return data.body.albums.items.map(function(a) { return a.id; });
        })
        .then(function(albums){
          if(albums.length){
            return spotifyApi.getAlbums(albums);
          }
        })
        .then(function(data){
          if(data){
            data.body.albums.forEach(function(item){
              console.log('# ', item.release_date, ' -> ', item.artists[0].name, ' –> ', item.name)

              delete item.available_markets;
              delete item.tracks;

              chartsSpotify[i].spotify = item;
            });
          }
        })
        .catch(function(err){
          console.error(err);
        });
    }//for

    return chartsSpotify;

}//run
