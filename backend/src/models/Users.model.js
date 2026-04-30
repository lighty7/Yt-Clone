const { DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../config/database");

const Users = sequelize.define("users",{
 id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    passwordHash:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    bio:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    profilePictureUrl:{
    type:DataTypes.STRING,
    allowNull:true
    },
    isActive:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true
    }
})
module.exports = Users;