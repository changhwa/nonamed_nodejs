module.exports = {
    up: function(migration, DataTypes, done) {
        migration.migrator.sequelize.query(
            "INSERT INTO approvalLine" +
                "(approvalLineUid, approverEmail, approverName," +
                "approverPositionOffice, approverOrder, approverType," +
                "approverTypeName, approverPrcDate, approverAppCd," +
                "approverAppCdName,docUid)" +
            "VALUES" +
                "('uid0','money0@nonamed.io','돈영원'," +
                "NULL,'0',NULL," +
                "NULL,NULL,'APDN'," +
                "NULL,'a8655700-5df2-11e4-9cd0-f7a498a897da')," +
                "('uid1','money1@nonamed.io','돈일원'," +
                "NULL,'1',NULL," +
                "NULL,NULL,'APWT'," +
                "NULL,'a8655700-5df2-11e4-9cd0-f7a498a897da')," +
                "('uid2','money2@nonamed.io','돈이원'," +
                "NULL,'2',NULL," +
                "NULL,NULL,'APNN'," +
                "NULL,'a8655700-5df2-11e4-9cd0-f7a498a897da')")
        migration.migrator.sequelize.query(
            "INSERT INTO approvalLine" +
                "(approvalLineUid, approverEmail, approverName," +
                "approverPositionOffice, approverOrder, approverType," +
                "approverTypeName, approverPrcDate, approverAppCd," +
                "approverAppCdName,docUid)" +
            "VALUES" +
                "('uid3','money0@nonamed.io','돈영원'," +
                "NULL,'0',NULL," +
                "NULL,NULL,'APDN'," +
                "NULL,'bf466d10-5df2-11e4-9cd0-f7a498a897da')," +
                "('uid4','money1@nonamed.io','돈일원'," +
                "NULL,'1',NULL," +
                "NULL,NULL,'APWT'," +
                "NULL,'bf466d10-5df2-11e4-9cd0-f7a498a897da')," +
                "('uid5','money2@nonamed.io','돈이원'," +
                "NULL,'2',NULL," +
                "NULL,NULL,'APNN'," +
                "NULL,'bf466d10-5df2-11e4-9cd0-f7a498a897da')").complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}