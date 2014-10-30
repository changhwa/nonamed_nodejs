/**
 *
 * 부서, 사용자 초기 테스트 데이터 생성 마이그레이션
 *
 */
module.exports = {
    up: function(migration, DataTypes, done) {

        //User

        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('ea11111111','1234','테스터1','대리','대리')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('eb11111111','1234','테스터2','과장','과장')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('ec11111111','1234','테스터3','사원','사원')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('ed11111111','1234','테스터4','부장','부장')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('ee11111111','1234','테스터5','대리','대리')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('ef11111111','1234','테스터6','사원','사원')");
        migration.migrator.sequelize.query("INSERT INTO " +
            "USERS(code, passwd, name, office, position) " +
            "VALUES('eg11111111','1234','테스터7','사원','사원')").complete(done);

    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}