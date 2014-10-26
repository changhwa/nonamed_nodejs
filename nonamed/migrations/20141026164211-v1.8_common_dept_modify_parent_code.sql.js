module.exports = {
    up: function(migration, DataTypes, done) {
        migration.changeColumn(
            'Department',
            'parent_dept_code',
            {
                type: DataTypes.STRING(50)
            }
        ).complete(done);

    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}