/**
 *
 * 부서, 사용자 초기 테스트 데이터 생성 마이그레이션
 *
 */
module.exports = {
    up: function(migration, DataTypes, done) {

        //dept_user
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('1','ea11111111','db11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('2','eb11111111','db11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('3','ec11111111','dc11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('4','ed11111111','dd11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('5','ee11111111','dd11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('6','ef11111111','dd11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "dept_user(id, user_code, department_code) " +
            "VALUES('7','eg11111111','de11111111')").complete(done);

    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}