const express = require('express')
const models = require('./models/models.js');
const port = 3000
const app = express();

let productCount;
models.getProductsCount()
.then(result => {
  productsCount = result
})



app.use(express.json())
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})


/**********************************
 *             ROUTES
 *********************************/

app.get('/products', (req, res) => {
  let pageAndCount = {page: '1', count: '5'};
  let params = req.url.replace('/products/', '')
  params = params.replace('?', '').split('&')
  if (params[0] !== '') {
    params.forEach(param => {
      param = param.split('=');
      pageAndCount[param[0]] = param[1];
    })
  }
  pageAndCount.count = (Number(pageAndCount.count) > 10 || pageAndCount.count === '')? '10' : pageAndCount.count;
  if (isValidParam('products', pageAndCount.page, res)) {
    models.getAllProducts(pageAndCount)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(new Error(err))
      res.status(500)
    })
  }
})


app.get('/products/:product_id', (req, res) => {
  let id = req.url.replace('/products/', '')
  if (isValidParam('productId', id, res)) {
    models.getProductById(id)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(error => {
      console.log(new Error(error))
      res.status(500);
    })
  }
})


app.get('/products/:product_id/styles', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/styles', '');
  if (isValidParam('styles', id, res)) {
    models.getProductStyles(id)
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      console.log(new Error(err))
      res.status(500)
    })
  }
})


app.get('/products/:product_id/related', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/related', '');
  if (isValidParam('related', id, res)) {
    models.getRelatedProducts(id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(new Error(err))
      res.sendStatus(500)
    })
  }
})


/////////////////////////////////////////////////////////////////

const isValidParam = (endpoint, val, res) => {
  let err422 = 'invalid query parameter'
  let err416 = 'product does not exist'
  if (endpoint === 'productId' || endpoint === 'styles' || endpoint === 'related') {
    try {
      if (Number.isNaN(Number(val))) {
        throw(err422)
      } else if (Number(val) < 1 || Number(val) > productsCount) {
        throw(err416)
      }
    }
    catch (error) {
      if (error === err422) {
        res.status(422).send('422 Error: Unprocessable Entity. Your query parameter for /products must be an integer')
      } else if (error === err416) {
        res.status(416).send('The product ID you chose does not exist')
      }
      return false;
    }
  } else {
    if (val < 1 || val > 100002) {
      res.sendStatus(416);
      return false;
    }
  }
  return true;
}