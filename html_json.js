var fs       = require('fs');
var cheerio  = require('cheerio');
var utf8     = require('utf8');


var input_dir = 'input/products/';

file_counter = 0;

fs.readdir(input_dir, (err, files) => {
	files.forEach(file => {

		var html_file_content = fs.readFileSync(input_dir + file, 'utf8');

		process_html(html_file_content);
		file_counter++;
		console.log('file #' + file_counter);
	});
});

function process_html(html)
{
	if (typeof(html) == 'undefined' || html == '')
	{
		return false;
	}

	$ = cheerio.load(html, { decodeEntities: false });
	
	var product = {};

	product['url']         = $('link[rel="canonical"]').attr('href');
	product['id']          = $('.mp-small_rate').attr('mp-prod_id');
	product['title']       = $('h1.name').text().trim(); 
	product['description'] = $('.descriptionContent.rawContent').html().trim(); 
	product['specs']       = [];
	product['photos']      = [];
	product['breadcrumbs'] = [];

	// Getting specs
	$('#fullSpecsInTab > .tableInfo > .row').each(function (i, elem){

		var spec_name  = $(this).children('.name').text().trim();
		var spec_value = $(this).children('.value').text().trim();

		if (typeof(page_id) == 'undefined' && spec_name == 'Код товара:')
		{
			page_id = spec_value;
		}

		product['specs'][i] = {
			'name'  : spec_name,
			'value' : spec_value
		};
	});

	// Getting photos
	$('.photoBlock a').each(function (i, elem) {
		product['photos'][i] = $(this).attr('href');
	});

	// Getting breadcrumbs
	$('.navigation span[itemprop="title"]').each(function (i, elem) {

		var title = $(this).text();

		if (title != null && title != 'Главная')
		{
			product['breadcrumbs'][i] = title;
		}
	});

	fs.writeFileSync('output/products/' + product['id'] + '.json', JSON.stringify(product), 'utf8');
}