"use strict";

module.exports  = function(sequelize, DataTypes) {
    var Department =  sequelize.define("Department", {
        code: {
            type: DataTypes.STRING(20),
            primaryKey: true
        },
        dept_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        use_yn : {
            type: DataTypes.STRING(1),
            defaultValue: 'Y'
        },
        parent_dept_code: DataTypes.STRING(20)
    },{
        underscored: true,
        timestamps: false,
        tableName: 'Department'
    });

    return Department;
};
