var fs          = require('fs');
var getSlug     = require('speakingurl');
var input_dir   = 'output/products/';
var output_file = 'magento_dump';
//var file_header = 'sku,store_view_code,attribute_set_code,product_type,categories,product_websites,name,description,short_description,weight,product_online,tax_class_name,visibility,price,special_price,special_price_from_date,special_price_to_date,url_key,meta_title,meta_keywords,meta_description,created_at,updated_at,new_from_date,new_to_date,display_product_options_in,map_price,msrp_price,map_enabled,gift_message_available,custom_design,custom_design_from,custom_design_to,custom_layout_update,page_layout,product_options_container,msrp_display_actual_price_type,country_of_manufacture,additional_attributes,qty,out_of_stock_qty,use_config_min_qty,is_qty_decimal,allow_backorders,use_config_backorders,min_cart_qty,use_config_min_sale_qty,max_cart_qty,use_config_max_sale_qty,is_in_stock,notify_on_stock_below,use_config_notify_stock_qty,manage_stock,use_config_manage_stock,use_config_qty_increments,qty_increments,use_config_enable_qty_inc,enable_qty_increments,is_decimal_divided,website_id,deferred_stock_update,use_config_deferred_stock_update,related_skus,crosssell_skus,upsell_skus,hide_from_product_page,custom_options,bundle_price_type,bundle_sku_type,bundle_price_view,bundle_weight_type,bundle_values,associated_skus\r\n';
var file_header = 'sku|attribute_set_code|product_type|categories|product_websites|name|description|short_description|weight|product_online|tax_class_name|visibility|price|url_key|display_product_options_in|msrp_display_actual_price_type|additional_attributes|qty|out_of_stock_qty|use_config_min_qty|is_qty_decimal|allow_backorders|use_config_backorders|min_cart_qty|use_config_min_sale_qty|max_cart_qty|use_config_max_sale_qty|is_in_stock|notify_on_stock_below|use_config_notify_stock_qty|manage_stock|use_config_manage_stock|use_config_qty_increments|qty_increments|use_config_enable_qty_inc|enable_qty_increments|is_decimal_divided|website_id|deferred_stock_update|use_config_deferred_stock_update|bundle_price_type|bundle_sku_type|base_image\r\n';

var required_fiels = {};
var optional_fiels = {};


file_counter = 0;



fs.readdir(input_dir, (err, files) => {
	files.forEach(file => {

		var file_name = 'dump/' + output_file + '_' + Math.floor(file_counter / 1000) + '.csv';

		if (!fs.existsSync(file_name))
		{
			fs.writeFileSync(file_name, file_header);
		}
		
		//if (file_counter < 5000)
		//{
			var json_content = JSON.parse(fs.readFileSync(input_dir + file, 'utf8'));

			dump_line = process_json(json_content, file_counter);

			fs.appendFile(file_name, dump_line, function (err) {

			});

			file_counter++;

			console.log('file #' + file_counter + ': ' + file);
		//}
	});
});

function format_description (str, is_xhtml) {
/*    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');*/

    if (typeof(str) == 'undefined' || str == null || str.length > 1000)
    {
    	return '';
    }
    else
    {
    	return (str + '').replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/\t/, '').replace(/(\||,)/g, "/");
    }
}

function process_json (data)
{
	var category = '';

	if (data['breadcrumbs'].length > 0)
	{
		for (i in data['breadcrumbs'])
		{
			if (data['breadcrumbs'][i] != null)
			{
				if (category == '')
				{
					category += 'Default Category/' + data['breadcrumbs'][i];
				}
				else
				{
					category += ',' + category + '/' + data['breadcrumbs'][i];
				}
			}
		}
	}

	var description = format_description(data['description']);

	var dump_line = '';
	
	dump_line += data['id'] + '|';            // sku
	dump_line += 'Default|';                  // attribute_set_code
	dump_line += 'simple|';                   // product_type
	dump_line += '"' + category + '"|';       // categories
	dump_line += 'base|';                     // product_websites
	dump_line += '"' + data['title'] + '"|';  // name
	dump_line += '"' + description + '"|';    // description
	//dump_line += '|';                         // short_description
	dump_line += '|';                         // short_description
	dump_line += '1|';                        // weight
	dump_line += '1|';                        // product_online
	dump_line += 'Taxable Goods|';            // tax_class_name
	dump_line += '"Catalog, Search"|';        // visibility
	dump_line += '"' + Math.floor(Math.random() * (100000 - 1500) + 1500) + '"|';  // price
	dump_line += '"' + getSlug(data['title'], {separator: '-',  lang: 'ru'}) + data['id'] + '"|';  // url_key TODO: slag
	/*dump_line += '|';                         // meta_title
	dump_line += '|';                         // meta_keywords
	dump_line += '|';                         // meta_description
	dump_line += '|';                         // created_at
	dump_line += '|';                         // updated_at
	dump_line += '|';                         // new_from_date
	dump_line += '|';                         // new_to_date*/
	dump_line += 'Block after Info Column|';  // display_product_options_in
	/*dump_line += '|';                         // map_price
	dump_line += '|';                         // msrp_price
	dump_line += '|';                         // map_enabled
	dump_line += '|';                         // gift_message_available
	dump_line += '|';                         // custom_design
	dump_line += '|';                         // custom_design_from
	dump_line += '|';                         // custom_design_to
	dump_line += '|';                         // custom_layout_update
	dump_line += '|';                         // page_layout
	dump_line += '|';                         // product_options_container*/
	dump_line += 'Use config|';               // msrp_display_actual_price_type
	//dump_line += '|';                         // country_of_manufacture
	dump_line += '"has_options=1,shipment_type=together,quantity_and_stock_status=In Stock,required_options=0"|';  // additional_attributes
	dump_line += '"' + Math.floor(Math.random() * (1000 - 15) + 15) + '"|';  // qty
	dump_line += '0|';                        // out_of_stock_qty
	dump_line += '1|';                        // use_config_min_qty
	dump_line += '0|';                         // is_qty_decimal
	dump_line += '|';                         // allow_backorders
	dump_line += '1|';                        // use_config_backorders
	dump_line += '1|';                        // min_cart_qty
	dump_line += '1|';                        // use_config_min_sale_qty
	dump_line += '|';                         // max_cart_qty
	dump_line += '1|';                        // use_config_max_sale_qty
	dump_line += '1|';                        // is_in_stock
	dump_line += '|';                         // notify_on_stock_below
	dump_line += '1|';                        // use_config_notify_stock_qty
	dump_line += '1|';                        // manage_stock
	dump_line += '1|';                        // use_config_manage_stock
	dump_line += '1|';                        // use_config_qty_increments
	dump_line += '0|';                        // qty_increments
	dump_line += '1|';                        // use_config_enable_qty_inc
	dump_line += '0|';                        // enable_qty_increments
	dump_line += '0|';                        // is_decimal_divided
	dump_line += '1|';                        // website_id
	dump_line += '0|';                        // deferred_stock_update
	dump_line += '1|';                        // use_config_deferred_stock_update
	/*dump_line += '|';                         // related_skus
	dump_line += '|';                         // crosssell_skus
	dump_line += '|';                         // upsell_skus
	dump_line += '|';                         // hide_from_product_page
	dump_line += '|';                         // custom_options*/
	dump_line += 'fixed|';                    // bundle_price_type
	dump_line += 'fixed';                    // bundle_sku_type
	/*dump_line += '|';                         // bundle_price_view
	dump_line += '|';                         // bundle_weight_type
	dump_line += '|';                         // bundle_values
	dump_line += '';                          // associated_skus*/

	//base_image
	
	dump_line += '\r\n';

	return dump_line;
}
