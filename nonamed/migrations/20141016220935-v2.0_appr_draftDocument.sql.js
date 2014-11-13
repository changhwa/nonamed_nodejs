module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable(
            'DraftDocument',
            {
                docUid: {
                    type: DataTypes.STRING,
                    primaryKey: true
                },
                subject: DataTypes.STRING,
                contents : DataTypes.STRING,
                distributionType: DataTypes.STRING,
                docStatus: DataTypes.STRING
            },
            {
                charset: 'utf8'
            }
        ).complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}