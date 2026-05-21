var express = require('express');
var multiparty = require('multiparty');
let {login} = require("../model/db")
let {Op} = require("sequelize")
var router = express.Router();
let svg=require('svg-captcha')
let xlsx=require("node-xlsx")
let jwt=require("jsonwebtoken")
let expressJwt=require("express-jwt")

/* 列表 */
router.post('/login',async function(req, res, next) {
    const {name}=req.body
    console.log(name)
   if(!/^[a-zA-Z0-9_]{6,18}$/.test(name)){
    res.send({
        code:400,
        msg:'用户名必须是6~18位的长度'
    })
   }
   if(name=="admin_123"){
    const token =jwt.sign({name},'123456',{expiresIn:'1h'})
    res.send({
        code:200,
        msg:'登陆成功',
        token 
    })
   }else{ 
    res.send({ 
        code:401,
        msg:'用户名错误'
    }) 
   }
}); 

/* 添加 */
router.post('/add',async function(req, res, next) {
   
});

/* 修改 */
router.post('/edit',async function(req, res, next) {
   
});

/* 删除 */
router.post('/del',async function(req, res, next) {
   
});

module.exports = router;
