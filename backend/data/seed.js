const bcrypt = require('bcryptjs');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// test data that gets added to the database on startup if the collection is empty
const testData = [
  { foodname: 'Angus AAA Beef Slice',        description: 'Premium thin sliced Angus AAA beef for grilling',             category: 'main',      price: 10.99, vegan: false, chicken: false, beef: true,  pork: false },
  { foodname: 'Boneless Short Rib',          description: 'Boneless beef short rib, perfect for grilling',               category: 'main',      price: 13.99, vegan: false, chicken: false, beef: true,  pork: false },
  { foodname: 'Marinated Pork Belly',        description: 'Thinly sliced pork belly with sweet and savory marinade',     category: 'main',      price: 11.99, vegan: false, chicken: false, beef: false, pork: true  },
  { foodname: 'Special Chicken Breast',      description: 'Marinated chicken breast in house special sauce',             category: 'main',      price: 9.99,  vegan: false, chicken: true,  beef: false, pork: false },
  { foodname: 'Garlic Shrimp',               description: 'Fresh shrimp cooked with garlic butter',                      category: 'main',      price: 12.99, vegan: false, chicken: false, beef: false, pork: false },
  { foodname: 'Beef Tongue Slice',           description: 'Marinated thin sliced beef tongue, delicate flavor',          category: 'main',      price: 17.99, vegan: false, chicken: false, beef: true,  pork: false },
  { foodname: 'Grilled Vegetables Platter',  description: 'Seasonal vegetables marinated in sesame oil and garlic',      category: 'main',      price: 8.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Kimchi Pancake',              description: 'Crispy Korean pancake with fermented kimchi',                 category: 'appetizer', price: 6.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Spring Rolls (4pc)',          description: 'Fresh vegetable spring rolls with sweet chili sauce',         category: 'appetizer', price: 5.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Steamed Rice',                description: 'Fluffy jasmine white rice',                                   category: 'side',      price: 2.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Fried Rice',                  description: 'Egg fried rice with mixed vegetables',                        category: 'side',      price: 4.99,  vegan: false, chicken: false, beef: false, pork: false },
  { foodname: 'Miso Soup',                   description: 'Traditional Japanese soup with tofu and seaweed',             category: 'side',      price: 3.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Mochi Ice Cream',             description: 'Japanese rice cake filled with ice cream, assorted flavors',  category: 'dessert',   price: 6.99,  vegan: false, chicken: false, beef: false, pork: false },
  { foodname: 'Green Tea',                   description: 'Hot or iced Japanese green tea',                              category: 'beverage',  price: 2.99,  vegan: true,  chicken: false, beef: false, pork: false },
  { foodname: 'Ramune Soda',                 description: 'Classic Japanese carbonated soft drink',                      category: 'beverage',  price: 3.99,  vegan: true,  chicken: false, beef: false, pork: false }
];

// premade accounts
const userData = [
  { username: 'staff1',  password: 'password123', role: 'staff', tableNumber: null },
  { username: 'staff2',  password: 'password123', role: 'staff', tableNumber: null },
  { username: 'table1',  password: 'table1pass',  role: 'table', tableNumber: 1    },
  { username: 'table2',  password: 'table2pass',  role: 'table', tableNumber: 2    },
  { username: 'table3',  password: 'table3pass',  role: 'table', tableNumber: 3    },
  { username: 'table4',  password: 'table4pass',  role: 'table', tableNumber: 4    },
  { username: 'table5',  password: 'table5pass',  role: 'table', tableNumber: 5    },
];

async function seedDatabase() {
    // populate menu items
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
        await MenuItem.insertMany(testData);
        console.log('Added ' + testData.length + ' test items to the database');
    } else {
        console.log('Menu already has data');
    }

    // populate user accounts
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        const hashed = await Promise.all(
            userData.map(async (u) => ({
                ...u,
                password: await bcrypt.hash(u.password, 10)
            }))
        );
        await User.insertMany(hashed);
        console.log('Added ' + userData.length + ' user accounts to the database');
    } else {
        console.log('Users already exist');
    }
}

module.exports = { seedDatabase };
