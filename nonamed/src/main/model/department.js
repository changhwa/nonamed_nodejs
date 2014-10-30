"use strict";

module.exports  = function(sequelize, DataTypes) {
    var User   = sequelize.import(__dirname + "/user");
    var DeptUser = sequelize.import(__dirname + "/deptUser");
    var Department =  sequelize.define("Department", {
        code: {
            type: DataTypes.STRING(50),
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
        parent_dept_code: DataTypes.STRING(50),
        path: DataTypes.STRING,
        level: DataTypes.INTEGER
    },{
        underscored: true,
        timestamps: false,
        tableName: 'Department',
        "classMethods" : {
            "associate" : function (models) {
                models.Department.hasMany(models.User, { "through" :models.DeptUser });
            }
        }
    });

    return Department;
};
