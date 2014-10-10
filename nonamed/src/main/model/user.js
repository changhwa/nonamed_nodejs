"use strict";

module.exports  = function(sequelize, DataTypes) {
    var User =  sequelize.define("User", {
        email: {type: DataTypes.STRING, primaryKey: true},
        passwd: DataTypes.STRING,
        name : DataTypes.STRING,
        auth_key : DataTypes.STRING,
        office: DataTypes.STRING,
        position: DataTypes.STRING,
        security_grade: DataTypes.STRING
    },{
        underscored: true,
        timestamps: false,
        tableName: 'users'
    });
    return User;
};