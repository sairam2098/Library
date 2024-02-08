const express = require('express');
const router = express.Router();
const usersDAO = require('./usersDAO');
const path = require('path');

router.get('/:search', async(req,res) => {
    try{
        const search = req.params.search;
        const books = await usersDAO.getByString(search);
        res.status(200).json(books);
    }catch(e){
        console.log(e);
    }
})

router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/Library.html'));
})

module.exports= router;