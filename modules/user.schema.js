const { Sequelize } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('ToDoTable', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dateUpdate: {
            type: Sequelize.DATE,
        },
        isDeleted: {
            type: Sequelize.INTEGER,
        }
    }, {
        tableName: 'ToDoTable',
        timestamps: false
    });
}
