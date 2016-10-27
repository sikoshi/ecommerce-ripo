var http     = require('http');
var fs       = require('fs');
var cheerio  = require('cheerio');


var sitemap_file= 'input/sitemap.xml';

if (!fs.existsSync(sitemap_file))
{
    var file = fs.createWriteStream(sitemap_file);
    var request = http.get('http://alser.kz/sitemaps/almaty/sitemap.xml', function(response) {
        response.pipe(sitemap_file);
    });
}