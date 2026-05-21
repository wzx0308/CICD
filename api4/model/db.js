require('dotenv').config();

let {Sequelize, DataTypes} = require("sequelize")

let se = new Sequelize(
    process.env.DB_NAME || "db2506a",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "root",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false
    }
)

//定义模型
let login = se.define("login",{
    name : DataTypes.STRING
},{
    tableName : "login",
    timestamps : false
})

//关联模型（根据表关联关系 没有关联的表不需要进行模型关联 ）
// 主表模型.hasMany(从表模型)
// 从表模型.belongsTo(主表模型)

//同步模型
se.sync({alter:true}).then(()=>{
    console.log("同步成功");
}).catch(err=>{
    console.log(err);
})

//暴露模型

module.exports = {
    login
}