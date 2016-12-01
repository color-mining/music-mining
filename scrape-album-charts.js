var Nightmare = require('nightmare');
var vo = require('vo');
var fs = require('fs');

vo(run)(function(err, result) {
    if (err) throw err;
});

//currently the script runs only with defined MAX_PAGE
function * run() {
    var nightmare = Nightmare();
    var firstYear = 1979;
    var lastYear = 2015;
    var currentYear = firstYear;
    var data = [];

    while (currentYear <= lastYear) {

      console.log('[Y] ----- ' + currentYear + ' -------------------');
      url = 'https://www.offiziellecharts.de/charts/album-jahr/for-date-'+currentYear.toString();

      yield nightmare
        .goto(url)
        .wait('.chart-table')
        .evaluate(function(year) {

          var alben = [];
          $('.drill-down-link').each(function(){
            var album = new Object();

            album.artist = $(this).find('.info-artist').text();
            album.title = $(this).find('.info-title').text();
            album.year = year;

            alben.push(album);
          });

          return alben;

        }, currentYear)
        .then(function(alben){
          console.dir(alben);
          data = data.concat(alben);
        })
        .catch(function(error) {
          console.error('error', error);
        });

        currentYear++;
    }





    console.dir(data);
    data = JSON.stringify(data, null, 2)

    //write results to timestamped json file
    results = './results'

    if(!fs.existsSync(results)){
        fs.mkdirSync(results);
    }
    fs.writeFile('results/output.json', data, 'utf8');
    yield nightmare.end();
}
