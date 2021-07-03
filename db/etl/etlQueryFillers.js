
const formatProductQueryValues = (formattedLine) => {
  let id = Number(Object.keys(field)[0]);
  let tableValues = {
    id: id,
    name: formattedLine[id].name,
    slogan: formattedLine[id].slogan,
    description: formattedLine[id].description,
    category: formattedLine[id].category,
    default_price: formattedLine[id].default_price
  }
  return fillQueryValuesArray(tableValues)
}

const formatStylesQueryValues = (formattedLine) => {
  let id = Object.keys(formattedLine)[0];
  let tableValues = {
    id: id,
    name: formattedLine[id].name,
    original_price: formattedLine[id].original_price,
    sale_price: formattedLine[id].sale_price,
    default_style: formattedLine[id].default_style,
    product_id: formattedLine[id].productId
  }
  return fillQueryValuesArray(tableValues)
}

const formatFeaturesQueryValues = (formattedLine) => {
  let id = Object.keys(formattedLine)[0];
  let tableValues = {
    id: id,
    feature: formattedLine[id].feature,
    value: formattedLine[id].value,
    product_id: formattedLine[id].product_id
  }
  return fillQueryValuesArray(tableValues)
}

const formatPhotosQueryValues = (formattedLine) => {
  let id = Object.keys(formattedLine)[0];
  let tableValues = {
    id: id,
    thumbnail_url: formattedLine[id].thumbnail_url,
    url: formattedLine[id].url,
    styleId: formattedLine[id].styleId,
    productId: null
  }
  return fillQueryValuesArray(tableValues)
}

const formatSKUsQueryValues = (formattedLine) => {
  let id = Number(Object.keys(formattedLine)[0]);
  let tableValues = {
    id: id,
    quantity: formattedLine[id].quantity,
    size: formattedLine[id].size,
    styleId: formattedLine[id].styleId,
    productId: null
  }
  return fillQueryValuesArray(tableValues)
}

const formatRelatedQueryValues = (formattedData) => {
  let tableValues = {
    id: formattedData.id,
    relatedProducts: formattedData.relatedProducts
  }
  return fillQueryValuesArray(tableValues)
}

const fillQueryValuesArray = (tableValues) => {
  let queryValues = []
  for (let column in tableValues) {
    queryValues.push(tableValues[column])
  }
  return queryValues;
}

module.exports = {
  formatPhotosQueryValues: formatPhotosQueryValues,
  formatFeaturesQueryValues: formatFeaturesQueryValues,
  formatProductQueryValues: formatProductQueryValues,
  formatSKUsQueryValues: formatSKUsQueryValues,
  formatStylesQueryValues: formatStylesQueryValues,
  formatRelatedQueryValues: formatRelatedQueryValues,
  fillQueryValuesArray: fillQueryValuesArray
}