
This API Server/SQL Database system is built primarily out of the native Node.js modules fs, Readline, and MySQL database.


1. [ETL Modules](#etl-modules)
  * [Extraction](#extraction)
  * [Transformation](#transformation)
  * [Loading](#loading)
2. [Model Querying](#model-querying)
3. [Products API Server](#products-api-server)
4. [Using the Products API](#using-the-products-api)
5. [Deployment and Testing](#deployment-and-testing)


# ETL Modules

A Promise-based ETL system built to withstand the importing of large CSV files

- ## Extraction:
 Uses ReadLine module to stream data from CSV file
  -ETL TEMPLATE
    -etlFormat.js
    -etlQueryFillers.js
    -etlTemplateOptions.js
- ## Transformation:
  An all in one formatter function that prepares the data.
  -ETL FORMAT

- ## Loading:
  Features a simple and sturdy homebuilt buffering mechanism preventing heap overflow during SQL database load in.


  ### The Buffer
The buffer system ameliorates Readline's `.pause()` data bleed-over by counting the line data instances in a buffer counter, which decrements with every resolved SQL insertion query promise.  The Readline stream resumes (`.resume()`) when the buffer counter reaches 0.

This buffer system is its ability to be tested at a granular level if needed.

# Model Querying
Styles is the most expensive endpoint
  Need to update the querying to make this model less expensive.

# Products API Server
### Error handling
```isValidParam(endpoint, val, res)```
Enforces valid parameters in the client's URLs.
  * Custom messages are sent back depending on the error of the client.
  * Changes to the length of rows in the Products table of the products database will dynamically update ```productsCount``` on every restart of the server.
  * -Future implementation- Database listener which will allow ```productsCount``` to update without rebooting ```server.js```.
# Using the Products API
  * [List Products](#list-products)
  * [Product Information](#product-information)
  * [Product Styles](#product-styles)
  * [Related Products](#related-products)
## List Products
Retrieves the list of products:

```GET  /products```


|Parameter|Type|Description
|---|---|---|
|page|integer|Selects the page of results to return.  Default 1.
|count|integer|Specifies how many results per page to return.  Default 5.|
```
[
  {
        "id": 1,
        "name": "Camo Onesie",
        "slogan": "Blend in to your crowd",
        "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
        "category": "Jackets",
        "default_price": "140"
    },
  {
        "id": 2,
        "name": "Bright Future Sunglasses",
        "slogan": "You've got to wear shades",
        "description": "Where you're going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.",
        "category": "Accessories",
        "default_price": "69"
    },
  {
        "id": 3,
        "name": "Morning Joggers",
        "slogan": "Make yourself a morning person",
        "description": "Whether you're a morning person or not. Whether you're gym bound or not. Everyone looks good in joggers.",
        "category": "Pants",
        "default_price": "40"
    },
    // ...
]
```
----------------------

## Product Information
Returns all product level information for a specified product id:

```GET /products/:product_id```

|Parameter|Type|Description|
|---|---|---|
|product_id|integer|Required ID of the product requested|

```
{
    "id": 11,
    "name": "Air Minis 250",
    "slogan": "Full court support",
    "description": "This optimized air cushion pocket reduces impact but keeps a perfect balance underfoot.",
    "category": "Basketball Shoes",
    "default_price": "0",
    "features": [
  	{
            "feature": "Sole",
            "value": "Rubber"
        },
  	{
            "feature": "Material",
            "value": "FullControlSkin"
        },
  	// ...
    ],
}
```

------------
## Product Styles
Returns all styles for a given product:

```GET /products/:product_id/styles```
|Parameter|Type|Description|
|---|---|---|
|product_id|integer|Required ID of the product requested|

```
{
    "product_id": "1",
    "results": [
  	{
            "style_id": 1,
            "name": "Forest Green & Black",
            "original_price": "140",
            "sale_price": "0",
            "default?": true,
            "photos": [
  			{
                    "thumbnail_url": "urlplaceholder/style_1_photo_number_thumbnail.jpg",
                    "url": "urlplaceholder/style_1_photo_number.jpg"
                },
  			{
                    "thumbnail_url": "urlplaceholder/style_1_photo_number_thumbnail.jpg",
                    "url": "urlplaceholder/style_1_photo_number.jpg"
                }
  			// ...
            ],
        "skus": {
                	"37": {
                    		"quantity": 8,
                    		"size": "XS"
                	},
                	"38": {
                    		"quantity": 16,
                    		"size": "S"
                	},
                	"39": {
                    		"quantity": 17,
                    		"size": "M"
                	},
            //...
            	}
    },
  {
        "style_id": 2,
        "name": "Desert Brown & Tan",
        "original_price": "140",
        "sale_price": "0",
        "default?": false,
        "photos": [
  			{
                    "thumbnail_url": "urlplaceholder/style_2_photo_number_thumbnail.jpg",
                    "url": "urlplaceholder/style_2_photo_number.jpg"
        }
      // ...
            ],
        "skus": {
                	"37": {
                    		"quantity": 8,
                    		"size": "XS"
                	},
                	"38": {
                    		"quantity": 16,
                    		"size": "S"
                	},
                	"39": {
                    		"quantity": 17,
                    		"size": "M"
                	},
            //...
            	}
    },
  // ...
}
```
-------------------


## Related Products
Returns the id's of products related to the product specified.:

```GET /products/:product_id/related```

|Parameter|Tyoe|Description|
|---|---|---|
|product_id|integer|Required ID of the Product requested|

```
[
  2,
  3,
  8,
  7
],
```


# Deployment and Testing