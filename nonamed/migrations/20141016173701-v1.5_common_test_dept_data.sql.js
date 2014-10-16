/**
 *
 * 부서, 사용자 초기 테스트 데이터 생성 마이그레이션
 *
 */
module.exports = {
    up: function(migration, DataTypes, done) {

        //Department
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('1','테스트부서1',0)");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('db11111111','테스트부서1-1','1')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('dc11111111','테스트부서1-1-1','db11111111')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('dd11111111','테스트부서1-2','1')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('de11111111','테스트부서1-3','1')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code) " +
            "VALUES('df11111111','테스트부서1-4','1')").complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}