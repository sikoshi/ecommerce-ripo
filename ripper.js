var fs       = require('fs');
var request  = require('request');
var cheerio  = require('cheerio');

var sitemap_file = 'input/sitemap.xml';
var sitemap_url  = 'https://alser.kz/sitemaps/almaty/sitemap.xml';

if (!fs.existsSync(sitemap_file))
{
	console.log('no sitemap file');
}

var sitemap_content = fs.readFileSync(sitemap_file, 'utf8');

var sitemap = cheerio.load(sitemap_content, {xmlMode: true});

sitemap('url').map(function(i, url) {

	var page_url     = cheerio(url).find('loc').text();
	var page_id      = 0;
	var match_result = page_url.match(/(?:[a-z0-9_]+)(?:[_]+)([\d]+)/);

	if(page_url.match('^https://'))
	{
		page_url = page_url.replace("https://","http://");
    }

	if (match_result != null)
	{
		page_id = match_result[1];
	}

	if (page_id > 0)
	{
		if (!fs.exists('output/' + page_id + '.json'))
		{
			process_remote_page(page_url);
		}
	}
});


//process_remote_page('http://www.alser.kz/product/parfyumirovannaya_voda_missoni_edp_100_ml_1252074', 1252074);

function process_remote_page(url)
{
	request({ encoding: null, method: "GET", uri: url, proxy : 'http://127.0.0.1:3128', timeout : 30000}, function (error, response, body) {
    	if (!error && response.statusCode == 200)
	    {
	    	console.log('request complete');

			$ = cheerio.load(body);

	    	var page_id = $('.itemMeta.goodMeta').attr('data-code');

	    	var product = {};

	    	product['url']    = url;
	    	product['id']     = page_id;
	    	product['title']  = $('h1.name').text().trim();
	    	product['specs']  = [];
	    	product['photos'] = [];

	    	// Getting specs
	    	$('#fullSpecsInTab > .tableInfo > .row').each(function (i, elem){
	    		product['specs'][i] = {
	    			'name'  : $(this).children('.name').text().trim(),
	    			'value' : $(this).children('.value').text().trim()
	    		};
	    	});

	    	// Getting photos
	    	$('.photoBlock a').each(function (i, elem) {
	    		product['photos'][i] = $(this).attr('href');
	    	});

	    	console.log(JSON.parse(JSON.stringify(product)));

	    	fs.writeFile('output/' + product['id'] + '.json', JSON.stringify(product), function(err) {
			    if (err)
			    {
			        return console.log(err);
			    }
			});
	    }
	    else
	    {
	    	console.log('url: ' + url);
	    	console.log(response.statusCode);
	    	console.log(body)
			console.log('');
		}
	});

	return true;
}