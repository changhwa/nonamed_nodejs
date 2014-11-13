module.exports = {
    up: function(migration, DataTypes, done) {
        migration.migrator.sequelize.query(
            "INSERT INTO draftDocument(docUid, subject, contents, distributionType) " +
            "VALUES('56a9fd40-5df1-11e4-af09-3f0ff240fb97'," +
            "'휴가신청서_1027_1'," +
            "'6박7일 휴가신청합니다'," +
            "'ORDDOC')")
        migration.migrator.sequelize.query(
            "INSERT INTO draftDocument(docUid, subject, contents, distributionType) " +
            "VALUES('a8655700-5df2-11e4-9cd0-f7a498a897da'," +
            "'휴가신청서_1028_돈영원'," +
            "'휴가를 신청합니다'," +
            "'ORDDOC')")
        migration.migrator.sequelize.query(
            "INSERT INTO draftDocument(docUid, subject, contents, distributionType) " +
            "VALUES('b1366b80-5df2-11e4-9cd0-f7a498a897da'," +
            "'휴가신청서_1027_돈일원'," +
            "'1박2일 휴가를 신청합니다'," +
            "'ORDDOC')")
        migration.migrator.sequelize.query(
            "INSERT INTO draftDocument(docUid, subject, contents, distributionType) " +
            "VALUES('b705b1b0-5df2-11e4-9cd0-f7a498a897da'," +
            "'휴가신청서_1024_돈이원'," +
            "'4박5일 휴가를 신청합니다'," +
            "'ORDDOC')")
        migration.migrator.sequelize.query(
            "INSERT INTO draftDocument(docUid, subject, contents, distributionType) " +
            "VALUES('bf466d10-5df2-11e4-9cd0-f7a498a897da'," +
            "'휴가신청서_1021_돈삼원'," +
            "'14박15일을 신청합니다'," +
            "'ORDDOC')").complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}