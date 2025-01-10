module.exports = function getProducts (minPrice, maxPrice, name, products) {
    let filteredProducts = [...products];
    if (minPrice) filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    if (name) filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    return filteredProducts;
}