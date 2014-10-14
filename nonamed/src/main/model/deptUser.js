"use strict";

module.exports  = function(sequelize, DataTypes) {
    var DeptUser =  sequelize.define("DeptUser", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            references: "users",
            referencesKey: "code"
        },
        department_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            references: "Department",
            referencesKey: "code"
        }
    },{
        underscored: true,
        timestamps: false,
        tableName: 'dept_user'
    });

    return DeptUser;
};

