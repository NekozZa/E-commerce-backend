// Select or create the database
use products;

// Drop collection if it exists (optional)
db.products.drop();

// Read JSON file from container path
var products = cat('/docker-entrypoint-initdb.d/dataProduct.json'); // ensure JSON is directly inside the folder
products = JSON.parse(products);

// Insert data
db.products.insertMany(products);

print("Products data inserted successfully!");