/**
 *
 * 부서, 사용자 초기 테스트 데이터 생성 마이그레이션
 *
 */
module.exports = {
    up: function(migration, DataTypes, done) {

        //Department
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('1','테스트부서1',0,'0/1/','2')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('D12b74540-55c0-11e4-8ec4-8f295b65f3e0','테스트부서1-1','1','0/1/D12b74540-55c0-11e4-8ec4-8f295b65f3e0/','3')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('D12b74540-55c0-11e4-8ec4-8f295b65f3e1','테스트부서1-1-1','D12b74540-55c0-11e4-8ec4-8f295b65f3e0','0/1/D12b74540-55c0-11e4-8ec4-8f295b65f3e0/D12b74540-55c0-11e4-8ec4-8f295b65f3e1/','4')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('D12b74540-55c0-11e4-8ec4-8f295b65f3e2','테스트부서1-2','1','0/1/D12b74540-55c0-11e4-8ec4-8f295b65f3e2/','3')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('D12b74540-55c0-11e4-8ec4-8f295b65f3e3','테스트부서1-3','1','0/1/D12b74540-55c0-11e4-8ec4-8f295b65f3e3/','3')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "Department(code, dept_name, parent_dept_code, path, level) " +
            "VALUES('D12b74540-55c0-11e4-8ec4-8f295b65f3e4','테스트부서1-4','1','0/1/D12b74540-55c0-11e4-8ec4-8f295b65f3e4/','3')").complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}