const fillQueryFuncs = require('./etlQueryFillers.js')

let productOptions = {
  tableName: 'Products',
  csvPath: 'raw_data/product.csv',
  query: `INSERT INTO Products (ID, Name, Slogan, Prod_Description, Category, Default_Price) VALUES (?, ?, ?, ?, ?, ?);`,
  targetRowCount:1000011,
  fillValues: fillQueryFuncs.formatProductQueryValues
}
let stylesOptions = {
  tableName: 'Product_Styles',
  csvPath: 'raw_data/styles.csv',
  query:  `INSERT INTO Product_Styles (ID, Name, Original_Price, Sale_Price, Default_Style, Product_ID) VALUES (?, ?, ?, ?, ?, ?);`,
  targetRowCount:1958102,
  fillValues: fillQueryFuncs.formatStylesQueryValues
}
let featuresOptions = {
  tableName: 'Features',
  csvPath: 'raw_data/features.csv',
  query: `INSERT INTO Features (ID, Feature, Value, Product_ID) VALUES (?, ?, ?, ?)`,
  targetRowCount:2219279,
  fillValues: fillQueryFuncs.formatFeaturesQueryValues
}
let photosOptions = {
  tableName: 'Photos',
  csvPath: 'raw_data/photos.csv',
  query: `INSERT INTO Photos (ID, Thumbnail_URL, URL, Style_ID, Product_ID) VALUES (?, ?, ?, ?, ?)`,
  targetRowCount:5655656,
  fillValues: fillQueryFuncs.formatPhotosQueryValues
}
let skusOptions = {
  tableName: 'SKUs',
  csvPath: 'raw_data/skus.csv',
  query: `INSERT INTO SKUS (ID, Quantity, Size, Style_ID, Product_ID) VALUES (?, ?, ?, ?, ?)`,
  targetRowCount:11323917,
  fillValues: fillQueryFuncs.formatSKUsQueryValues
}
let relatedProductsOptions = {
  tableName: 'Related_Products',
  csvPath: 'raw_data/related.csv',
  query: `INSERT INTO Related_Products (ID, Product_IDs) VALUES (?, ?)`,
  targetRowCount: 1958102,
  fillValues: fillQueryFuncs.formatRelatedQueryValues
}

module.exports = {
  productOptions: productOptions,
  stylesOptions: stylesOptions,
  featuresOptions: featuresOptions,
  photosOptions: photosOptions,
  skusOptions: skusOptions,
  relatedProductsOptions: relatedProductsOptions
}