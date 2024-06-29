const sequelize = require('../config/db');
const User = require('./user');

sequelize.sync().then(() => {
    console.log('Database synced');
});

module.exports = { User };