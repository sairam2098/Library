const { Sequelize } = require('sequelize');
const bookSchema = require('./book.schema.js');
const userSchema = require('./user.schema.js');

const sequelize = new Sequelize('Library', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true
    }
});

module.exports = {
    getModels: async () => {
        await sequelize.authenticate();
        return {
            bookModel: bookSchema(sequelize),
            userModel: userSchema(sequelize)
        }
    }
}