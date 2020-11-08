const express = require('express');
const router = express.Router();
const usersDAO = require('./usersDAO');
router.get('/', async (req, res) => {
    try {
        const users = await usersDAO.getAll();
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
    }
}); 
router.post('/', async (req, res) => {
    try {
        await usersDAO.add(req.body);
        res.status(200).json({ message: 'Hello new User' });
    } catch (e) {
        console.log(e);
    }
});
router.delete('/:id', async (request, response)=>{
    try {
        const idT = request.params.id;
        await usersDAO.delete(idT);
        response.status(200).json({ message: 'User deleted' });
    } catch (e) {
        console.log(e);
    }
})
router.get('/:id', async (request, response)=>{
    try {
        const idT = request.params.id;
        const todoD = await usersDAO.getById(idT);
        response.status(200).json(todoD);
    } catch (e) {
        console.log(e);
    }
})
router.put('/:id', async(req,res)=>{
    try{
        const idT = req.params.id;
        await usersDAO.put(idT,req.body);
        res.status(200).json({ message: 'updated' });
    }catch(e){
        console.log(e);
    }
})
module.exports= router;