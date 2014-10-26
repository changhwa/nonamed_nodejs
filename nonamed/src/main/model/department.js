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
        tableName: 'Department'
    });

    Department.hasMany(User, { through: DeptUser });
    User.hasMany(Department, { through: DeptUser });
    return Department;
};
