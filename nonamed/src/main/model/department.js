"use strict";

module.exports  = function(sequelize, DataTypes) {
    var User   = sequelize.import(__dirname + "/user");
    var DeptUser = sequelize.import(__dirname + "/deptUser");
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

    Department.hasMany(User, { through: DeptUser });
    User.hasMany(Department, { through: DeptUser });
    // 마이그레이션 코드와 상관없이 다시 재생성함. 필요한가.
    sequelize.sync({force: 1}).on('success', function() {
        /**
         * Temp
         */

        var _user = User.build({
            code: '1',
            passwd: '1234',
            name: 'test'
        });

        var _user2 = User.build({
            code: '2',
            passwd: '1234',
            name: 'test2222'
        });

        var _dept = Department.build({
            code: '1',
            dept_name: '테스트1부서'
        });

        _dept.save().success(function(){
            console.log("_dept save >>>> ");
            _user.save().success(function(){
                _user2.save().success(function(){
                    console.log("_user save >>>> ");
                    _dept.setUsers([_user]).success(function() {
                        Department.find(1).success(function(dept){
                            dept.getUsers().success(function(user){
                                console.log(user);
                            });
                        });
                    });
                })
            });
        });

        console.log("_dept END >>>>>");

    });


    return Department;
};
