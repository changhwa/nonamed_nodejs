"use strict";

module.exports  = function(sequelize, DataTypes) {
    var User =  sequelize.define("User", {
        code: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        passwd: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        name: DataTypes.STRING(10),
        auth_key: DataTypes.STRING,
        office: DataTypes.STRING(100),
        position: DataTypes.STRING(100),
        security_grade: DataTypes.STRING(1)
    },{
        underscored: true,
        timestamps: false,
        tableName: 'users'
    });
    return User;
};