const format = require('./etlFormat.js');
const fs = require('fs')
const rl = require('readline')
const db = require('../db')


const ETL_TEMPLATE = (etlOptions) => {
  return new Promise((resolve, reject) => {
    let field, currentProductID, proceed;
    let isFirstLine = true;
    let buffer = 0;
    let rowCount = 0;
    let keys = [];
    let relatedProducts = [];
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + etlOptions.csvPath, 'utf8')
    let readLine = rl.createInterface({
      input: readStream
    });

    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        isFirstLine = false;
        line = line.split(',')
        keys = etlOptions.tableName === 'Related_Products' ? [] : line.map(key => key)
      } else {
        if (etlOptions.tableName === 'Related_Products') {
          [relatedProducts, field, proceed, currentProductID] = format.relatedProducts(line, relatedProducts, currentProductID);
          if (buffer === 0) {
            readLine.resume();
          }
          if (!proceed) {
            return;
          }
        } else {
          field = format.productsStylesFeaturesPhotosSKUS(line, keys)
        }
        let needIntermediaryQuery = etlOptions.tableName === 'SKUs' || etlOptions.tableName === 'Photos' ? true : false;
        let values = etlOptions.fillValues(field)
        return intermediaryQuery(needIntermediaryQuery, values)
        .then(result => {
          if (needIntermediaryQuery) {
            values[values.length - 1] = result;
          }
          buffer++;
          return insertField(etlOptions.query, values)
        })
        .then((result) => {
          buffer--;
          rowCount++;
          rowCount === etlOptions.targetRowCount ? resolve(`${etlOptions.csvPath} uploaded to SQL database`) : null;
          rowCount % 5000 === 0 ? console.log(rowCount) : null;
          buffer === 0 ? readLine.resume() : null
        })
        .catch((err) => {
          console.log(err)
        })
      }
      //reject(`${etlOptions.csvPath} FAILED to upload to SQL database`)
    })
  })
}

let intermediaryQuery = (needIntermediaryQuery, values) => {
  return new Promise ((resolve, reject) => {
    if (needIntermediaryQuery) {
      db.query(`SELECT Product_ID FROM Product_Styles WHERE ID = ${values[values.length - 2]}`, (err, result) => {
        err ? reject(new Error(err)) : resolve(result[0].Product_ID);
      });
    } else {
      resolve(values);
    }
  });
}

let insertField = (q, v) => {
  return new Promise((resolve, reject) => {
    db.query(q, v, (err, result) => {
      err ? reject(new Error(err)) : resolve(result);
    });
  });
}

module.exports = {
  ETL_TEMPLATE: ETL_TEMPLATE
}