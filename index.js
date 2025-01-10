const express = require('express');
const fs = require('fs');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { body, query, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const productsFile = './data/stock.json';
const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Store API',
      version: '1.0.0',
      description: 'Simple store API documentation',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./server/index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const validateRequest = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.get('/products', validateRequest([
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('name').optional().isString(),
]), (req, res) => {
  let filteredProducts = [...products];
  const { minPrice, maxPrice, name } = req.query;
  if (minPrice) filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  if (maxPrice) filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json(filteredProducts);
});

app.post('/checkout', validateRequest([
  body('cart').isArray().withMessage('Cart must be an array'),
  body('cart.*.id').isInt().withMessage('Product ID must be an integer'),
  body('cart.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]), (req, res) => {
  const { cart } = req.body;
  const updatedStock = [...products];

  for (const item of cart) {
    const product = updatedStock.find(p => p.id === item.id);
    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({ message: `Product ${item.id} is out of stock or insufficient.` });
    }
    product.quantity -= item.quantity;
  }

  fs.writeFileSync(productsFile, JSON.stringify(updatedStock, null, 2));
  res.json({ message: 'Checkout successful!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});