const { Sequelize } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('Book', {
        isbn: {
            type: Sequelize.BIGINT
        },
        title: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        availability: {
            type: Sequelize.BOOLEAN
        }
    }, {
        tableName: 'Book',
        timestamps: false
    });
}
