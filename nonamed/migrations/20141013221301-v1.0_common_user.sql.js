module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable(
            'users',
            {
                code: {
                    type: DataTypes.STRING(20),
                    primaryKey: true
                },
                passwd: {
                    type: DataTypes.STRING(20),
                    allowNull: false
                },
                name: DataTypes.STRING(10),
                auth_key: DataTypes.STRING,
                office: DataTypes.STRING(100),
                position: DataTypes.STRING(100),
                security_grade: DataTypes.STRING(1)
            },
            {
                charset: 'utf8'
            }
        ).complete(done);

        done() // sets the migration as finished
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}