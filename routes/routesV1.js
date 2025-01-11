const API_VERSION = "v1"
const { body, query } = require('express-validator');
const fs = require('fs');
const path = require('path');

const validateRequest = require('../middleware/validateRequest');
const productsController = require(`../controller/${API_VERSION}/products`);
const checkoutController = require(`../controller/${API_VERSION}/checkout`);

const stockPath = path.resolve(__dirname, '../data/stock.json');
const productsFile = fs.readFileSync(stockPath, 'utf-8');
const productsData = JSON.parse(productsFile);

module.exports = function currentRoute(app) {
    app.get('/', (req, res) => {
        return res.status(200).send('Ecoloop - Software Engineer Process')
    });

    app.get('/products', validateRequest([
        query('minPrice').optional().isFloat({ min: 0 }),
        query('maxPrice').optional().isFloat({ min: 0 }),
        query('name').optional().isString(),
    ]), (req, res) => {
        const { minPrice, maxPrice, name } = req.query;
        const products = productsController(minPrice, maxPrice, name, productsData);
        return res.json(products);
    });

    app.post('/checkout', validateRequest([
        body('cart').isArray().withMessage('Cart must be an array'),
        body('cart.*.id').isInt().withMessage('Product ID must be an integer'),
        body('cart.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
      ]), (req, res) => {
        const { cart } = req.body;
        const checkoutMade = checkoutController(cart, productsData, stockPath);
        return res.status(checkoutMade.code).json({ message: checkoutMade.message });
    });

}