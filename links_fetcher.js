var fs       = require('fs');
var request  = require('request');
var cheerio  = require('cheerio');


//var main_sitemap  = 'https://www.alser.kz/sitemaps/sitemap.xml';
var remote_sitemap  = 'https://www.alser.kz/sitemaps/almaty/sitemap.xml';
var local_sitemap   = 'input/sitemap.xml';

if (!fs.existsSync(local_sitemap))
{
    console.log('no sitemap file, downloading');

    request({ encoding: null, method: "GET", uri: remote_sitemap}, function (error, response, body) {
        if (!error && response.statusCode == 200)
        {
            fs.writeFile(local_sitemap, body, function(error) {

                if (error)
                {
                    return console.log(err);
                }
                else
                {
                    process_sitemap_file();
                }
            });
        }
    });
}
else
{
    process_sitemap_file();
}

function process_sitemap_file ()
{
    console.log('processing file');

    var sitemap_content = fs.readFileSync(local_sitemap, 'utf8');

    var sitemap = cheerio.load(sitemap_content, {xmlMode: true});

    var links_file   = 'output/links.txt';
    var file_content = '';
    var links_counter = 0;

    sitemap('url').map(function(i, url) {

        var page_url     = cheerio(url).find('loc').text();
        var page_id      = 0;
        var match_result = page_url.match(/(?:[a-z0-9_]+)(?:[_]+)([\d]+)/);

        if (match_result != null)
        {
            page_id = match_result[1];
        }

        if (page_id > 0)
        {
            links_counter++;

            file_content += page_url + '\r\n';
            console.log(page_url);
        }
    });


    fs.writeFile(links_file, file_content, function(error) {

        if (error)
        {
            return console.log(err);
        }
        else
        {
            return console.log(links_counter + 'links file saved')
        }
    });
}