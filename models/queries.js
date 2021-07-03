const db = require('../db/db.js')

 let queryProducts = (params) => {
  return new Promise((resolve, reject) => {
    let page = params.page;
    let count = params.count;
    let idMaxRange = page * 10;
    let idMinRange = idMaxRange - 9;
    let chosenMaxRange = count - 1 + idMinRange
    db.query(`SELECT * FROM Products WHERE ID >= ${idMinRange} AND ID <= ${chosenMaxRange};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryProductById = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM Products WHERE ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryProductStyles = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM Product_Styles WHERE Product_ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryFeatures = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM Features WHERE Product_ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let querySKUs = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM SKUs WHERE Product_ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryPhotos = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM Photos WHERE Product_ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryRelatedProducts = (productID) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM Related_Products WHERE ID = ${productID};`, (err, result)=> {
      err ? reject(err) : resolve(result);
    })
  })
}

let queryStylesSKUsPhotos = (productID) => {
  return new Promise ((resolve, reject) => {
    return Promise.all([queryProductStyles(productID), queryPhotos(productID), querySKUs(productID)])
      .then(results => {
        resolve(results);
      })
      .catch(err=> {
        reject(err)
      })
  })

}

const queryProductsCount = () => {
  return new Promise ((resolve, reject) => {
    let q = `SELECT COUNT(*) FROM Products`
    db.query(q, (err, results) => {
      err ? reject(err) : resolve(results)
    })
  })
}

module.exports = {
  queryProducts: queryProducts,
  queryProductById: queryProductById,
  queryProductStyles: queryProductStyles,
  queryFeatures: queryFeatures,
  querySKUs: querySKUs,
  queryPhotos: queryPhotos,
  queryRelatedProducts: queryRelatedProducts,
  queryStylesSKUsPhotos: queryStylesSKUsPhotos,
  queryProductsCount: queryProductsCount
}