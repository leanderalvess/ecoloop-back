const fs = require('fs');

module.exports = function postCheckout (cart, products, stockPath) {
    const updatedStock = [...products];

    for (const item of cart) {
      const product = updatedStock.find(p => p.id === item.id);
      if (!product || product.quantity < item.quantity) {
        return {
            code: 400,
            message: `Product ${item.id} is out of stock or insufficient.`
        }
      }
      product.quantity -= item.quantity;
    }

    fs.writeFileSync(stockPath, JSON.stringify(updatedStock, null, 2));
    return {
        code: 200,
        message: 'Checkout successful!'
    }
}