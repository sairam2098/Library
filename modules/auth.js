const express = require('express');
const router = express.Router();
const usersDAO = require('./usersDAO');

router.post('/', async(req,res) => {
    try{
        const ssn = req.params.ssn;
        const psw = req.params.psw;
        const resp = await usersDAO.authenticate(ssn, psw);
        if(resp) {
            res.status(200);
        }else {
            res.status(400);
        }
    }catch(e) {
        console.log(e);
        res.status(400);
    }
})

module.exports= router;