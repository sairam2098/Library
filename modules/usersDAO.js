const baseDao = require('./baseDao');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Library', 'root', 'root',{
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true
    }
});

function isPositiveInteger (str) {
    if (typeof str !== 'string') {
        return false;
      }
    
      const num = Number(str);
    
      if (Number.isInteger(num) && num > 0) {
        return true;
      }
    
      return false;
}

module.exports = {
    getByString: async (search) => {
        try {
            const models = await baseDao.getModels();
            const bookModel = models.bookModel;
            let query;
            if(isPositiveInteger(search)) {
                const isbn = Number(search);
                query = `select b.Isbn, b.Title, a.Name, b.availability from book b join book_authors ba on b.Book_id = ba.Book_id join authors a on a.Author_id = ba.Author_id where b.Isbn = ${isbn}`
            }else {
                query = `select b.Isbn, b.Title, a.Name, b.availability from book b join book_authors ba on b.Book_id = ba.Book_id join authors a on a.Author_id = ba.Author_id where b.Title like '%${search}%' or a.Name like '%${search}%'`
            }
            const books = await sequelize.query(query, {
                model: bookModel,
                mapToModel: true // pass true here if you have any mapped fields
            });
            const jsonData = books.map(e => e.toJSON());
            return jsonData;

        } catch (e) {
            console.log(e)
        }
    }
}
