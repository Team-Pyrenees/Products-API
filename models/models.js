const q = require ('./queries.js')


const getAllProducts = (params) => {
  return new Promise ((resolve, reject) => {
    q.queryProducts(params)
    .then(allProducts => {

      let formattedData = []
      let dataPacketKeys = Object.keys(allProducts);
      dataPacketKeys.forEach(key => {
        let product = {}
        product.id = allProducts[key].ID;
        product.name = allProducts[key].Name;
        product.slogan = allProducts[key].Slogan;
        product.description = allProducts[key].Prod_Description;
        product.category = allProducts[key].Category;
        product.default_price = allProducts[key].Default_Price;
        formattedData.push(product)
      });


      resolve(formattedData);
    })
    .catch(err => {
      reject(err)
    })
  })
}

const getProductById = (productID) => {
  return new Promise ((resolve, reject) => {
    let productPromise = q.queryProductById(productID)
    let featuresPromise = q.queryFeatures(productID);
    return Promise.all([productPromise, featuresPromise])
      .then(allData => {
        let product = allData[0]
        let features = allData[1]
        let formattedData = {
          id: product[0].ID,
          name: product[0].Name,
          slogan: product[0].Slogan,
          description: product[0].Prod_Description,
          category: product[0].Category,
          default_price: product[0].Default_Price,
          features: []
        }
        features.forEach(featureRowPacket => {
          let feature = {
            feature: featureRowPacket.Feature,
            value: featureRowPacket.Value
          }
          formattedData.features.push(feature)
        })
        resolve(formattedData);
     })
     .catch(err=> {
      reject(err)
     })
  })
}

const getProductStyles = (productID) => {
  return new Promise((resolve, reject) => {
    q.queryStylesSKUsPhotos(productID)
    .then(results => {
      let [styles, photos, skus] = results;
      let photosHash = {}
      let skusHash = {}
      photos.forEach(photo => photosHash[photo.Style_ID] === undefined ?
        photosHash[photo.Style_ID] = [{thumbnail_url: photo.Thumbnail_URL, url: photo.URL}]
        : photosHash[photo.Style_ID].push({thumbnail_url: photo.Thumbnail_URL, url: photo.URL}))
      skus.forEach(sku => {
        if (skusHash[sku.Style_ID] === undefined) {
          skusHash[sku.Style_ID] = {};
          skusHash[sku.Style_ID][sku.ID] = {quantity: sku.Quantity, size: sku.Size}
        } else {
          skusHash[sku.Style_ID][sku.ID] = {quantity: sku.Quantity, size: sku.Size}
        }
      })
      let formattedData = {
        product_id: `${productID}`,
        results: []
      }
      class Style {
        constructor (styleId, name, originalPrice, salePrice, defaultStyle, photos, skus) {
          this.style_id = styleId,
          this.name = name,
          this.original_price = originalPrice,
          this.sale_price = salePrice,
          this['default?'] = defaultStyle,
          this.photos = photos
          this.skus = skus
        }
      }
      styles.forEach((style, i)=> {
        let isDefault = styles[i].Default_Style === 1 ? true : false
        formattedData.results.push(new Style (styles[i].ID, styles[i].Name, styles[i].Original_Price, styles[i].Sale_Price, isDefault, photosHash[`${styles[i].ID}`], skusHash[`${styles[i].ID}`]))
      })
      resolve(formattedData);
    })
    .catch(err=>{
      reject(err);
    });
  })
}

const getRelatedProducts = (productID) => {
  return new Promise ((resolve, reject) =>{
    q.queryRelatedProducts(productID)
    .then(results => {
      let formattedData = results[0].Product_IDs
      resolve(JSON.parse(formattedData));
    })
    .catch(err => {
      reject(err)
    });
  })
}

const getProductsCount = () => {
  return new Promise((resolve, reject) => {
    q.queryProductsCount()
    .then(results => {
      resolve(results[0]['COUNT(*)'])
    })
    .catch(err => {
      reject(err)
    });
  });
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductById: getProductById,
  getProductStyles: getProductStyles,
  getRelatedProducts: getRelatedProducts,
  getProductsCount: getProductsCount
}