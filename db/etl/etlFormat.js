const productsStylesFeaturesPhotosSKUS = (line, keys) => {
  let tableEntry = {}
  let field = line.split(',')
  let id = field[0]
  tableEntry[id] = {};
  let value;
  keys.forEach((key, i) => {
    value = (
      key === 'url'
      || key === 'thumbnail_url'
      || key === 'name'
      || key === 'sale_price'
      || key === 'original_price'
      || key === 'default_price'
      || key === 'size'
      || key === 'slogan'
      || key === 'description'
      || key === 'category'
      || key === 'feature'
      || key === 'value'
      ) ? field[i].replace('"', '').replace('"', '')
      : (key === 'id' || key === 'style_id' || key === 'quantity' || 'productId') ? Number(field[i])
      : key === 'default?' ? ((field[i] === 'true') ? 1 : 0)
      : field[i];
    tableEntry[id][key] = value;
  });
  return tableEntry;
}


const relatedProducts = (line, relatedProducts, currentProductID) => {
  let [idColumn, relatedProduct] = line.split(',')
  let proceed = false;
  let field = null;
  if (currentProductID === undefined) {
    currentProductID = idColumn;
  } else if (currentProductID === idColumn) {
    relatedProducts.push(Number(relatedProduct))
  } else {
    let field = {
      id: currentProductID,
      relatedProducts: JSON.stringify(relatedProducts)
    }
    relatedProducts = [];
    proceed = true
  }
  return [relatedProducts, field, proceed, currentProductID]
}


module.exports = {
  relatedProducts: relatedProducts,
  productsStylesFeaturesPhotosSKUS: productsStylesFeaturesPhotosSKUS,
}