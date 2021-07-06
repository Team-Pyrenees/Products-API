# Products API/Database server

Built primarily out of the native Node.js modules and a MySQL database.

This is a fully functional and deployable API Server/Database system with a built-in automated ETL processor.

1. Setup for Self-Exploration

2. [Project Details](#project-details)
  * [ETL Modules](#etl-modules)
    * [Extraction](#extraction)
    * [Transformation](#transformation)
    * [Loading](#loading)
  * [Model Querying](#model-querying)
  * [Products API Server](#products-api-server)
  * [Using the Products API](#using-the-products-api)
  * [Deployment and Testing](#deployment-and-testing)

3. [API Documentation](#api-documentation)


# Project Details
  ## ETL Modules

```./db/etl```
  * ```etlinit.js```
  * ```etlTemplate.js```
  * ```etlFormat.js```
  * ```etlQueryFillers.js```
  * ```etlTemplateOptions.js```

Promise-based, automated process initialized through ```etlinit.js```.

Built to withstand the importing of large CSV files.

Decoupled from the API server so that it may be deployed on the database server separately from the API server.

Each CSV file is fed through ```etlTemplate.js```, along with its corresponding options (```etlTemplateOptions.js```) which contain specifications on the data's file source paths, database formatting, and its associated input queries (```etlQueryFillers.js```) which combines all stages of ETL

## Extraction:
  Uses ReadLine module to stream data from CSV file

## Transformation:
   contains an all in one formatter function that prepares the data.


## Loading:
  Features a simple and sturdy homebuilt buffering mechanism preventing heap overflow during SQL database load in.


  - ### The Buffer
    The buffer system ameliorates Readline's `.pause()` data bleed-over by counting the line data instances in a buffer counter, which decrements with every resolved SQL insertion query promise.  The Readline stream resumes (`.resume()`) when the buffer counter reaches 0.


## Model Querying
Styles is the most expensive endpoint
  Need to update the querying to make this model less expensive.

## Products API Server
  ### Error handling
  ```isValidParam(endpoint, val, res)```
  Enforces valid parameters in the client's URLs.
    * Custom messages are sent back depending on the error of the client.
    * Changes to the length of rows in the Products table of the products database will dynamically update ```productsCount``` on every restart of the server.
    * -Future implementation- Database listener which will allow ```productsCount``` to update without rebooting ```server.js```.
  ## Using the Products API


## Deployment and Testing




# API Documentation
  * ETL functions
    * eltQueryFiller.js
    * etlFormat.js
  * models.js functions
  * server.js functions
  * Endpoints


### Endpoints
  * [List Products](#list-products)
    * [Product Information](#product-information)
    * [Product Styles](#product-styles)
    * [Related Products](#related-products)
  ### List Products
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
