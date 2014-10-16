module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable(
            'department',
            {
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