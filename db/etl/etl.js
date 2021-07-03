const mysql = require ('mysql');
const db = require('../db');
const options = require('./etlTemplateOptions');
const etl = require('./etlTemplate.js');
const readline = require('readline');
const fs = require('fs');

etl.ETL_TEMPLATE(options.productOptions)
  .then(result=> {
  console.log(result)
    return etl.ETL_TEMPLATE(options.stylesOptions)
  })
  .then(result=>{
  console.log(result)
    return etl.ETL_TEMPLATE(options.featuresOptions)
  })
  .then(result=>{
    console.log(result)
    return etl.ETL_TEMPLATE(options.photosOptions)
  })
  .then(result =>{
    console.log(result)
    return etl.ETL_TEMPLATE(options.skusOptions)
  })
  .then(result=>{
    console.log(result)
    return etl.ETL_TEMPLATE(options.relatedProductsOptions)
  })
  .then(result=>{
    console.log(result)
    console.log('DATABASE LOAD COMPLETE')
  })
  .catch(_=> {
    console.log('Database load FAILED')
    db.end();
  });


  const findTargetRowCount = (etlOptions) => {
    let rowCount = 0;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + etlOptions.csvPath, 'utf8')
    let readLine = rl.createInterface({
      input: readStream
    });
    readLine.on('line', (line) => {
      rowCount++;
    })
  }
  readLine.on('close', () =>{

  }),