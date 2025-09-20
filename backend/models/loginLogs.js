const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const LoginLog =sequelize.define("loginLog",{
   id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true,
   },
   user_id:{
    type:DataTypes.INTEGER,
    allowNull:false
   },
   loginTime:{
    type:DataTypes.TIME,
    allowNull:false
   },
    ipAddress:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userAgent:{
        type:DataTypes.STRING,
        allowNull:false
    }
}) 
module.exports = LoginLog;