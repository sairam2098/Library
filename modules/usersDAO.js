const baseDao = require('./baseDao');
module.exports = {
    getAll: async () => {
        try {
            const models = await baseDao.getModels();
            const userModel = models.userModel;
            const data = await userModel.findAll();
            const jsonData = data.map(e => e.toJSON());
            console.log(jsonData);
            return jsonData;
        } catch (e) {
            console.log(e);
        }
    },
    add: async (todo) => {
        const models = await baseDao.getModels();
        const userModel = models.userModel;
        return userModel.create({
            text: todo.text
        })
    },
    delete: async (id) => {
        const models = await baseDao.getModels();
        const userModel = models.userModel;
        return userModel.destroy({
            where: {
                id: id
            }
        })
    },
    getById: async (id) => {
        try {
            const models = await baseDao.getModels();
            const userModel = models.userModel;
            const data = await userModel.findByPk(id);
            const toDo = data.toJSON();
            console.log(toDo);
            return toDo;
        } catch (e) {
            console.log("enter valid id");
        }
    },
    put: async(idT, todo) =>{
        const models = await baseDao.getModels();
        const userModel = models.userModel;
        return userModel.update(
            {text : todo.text},
            {where : {id : idT}}
        )
    }
}
