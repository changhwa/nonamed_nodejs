
module.exports = {
    up: function(migration, DataTypes, done) {
        migration.changeColumn(
            'Department',
            'code',
            {
                type: DataTypes.STRING(50)
            }
        );

        migration.changeColumn(
            'Department',
            'parent_dept_code',
            {
                type: DataTypes.STRING(50)
            }
        );

        migration.changeColumn(
            'Dept_User',
            'department_code',
            {
                type: DataTypes.STRING(50)
            }
        );

        migration.changeColumn(
            'users',
            'code',
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