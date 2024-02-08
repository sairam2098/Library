const { Sequelize } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('Borrower', {
        Card_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Ssn: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        Bname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        BPass: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Phone: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'BORROWER',
        timestamps: false
    });
}
