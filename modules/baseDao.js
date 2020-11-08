const { Sequelize } = require('sequelize');
const userSchema = require('./user.schema.js');

const sequelize = new Sequelize('ToDo', 'sa', 'ezetc',{
    host: 'localhost',
    dialect: 'mssql',
});

module.exports = {
    getModels: async () => {
        await sequelize.authenticate();
        return {
            userModel: userSchema(sequelize),
        }
    }
}