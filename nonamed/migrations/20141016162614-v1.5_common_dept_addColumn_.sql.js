
module.exports = {
    up: function(migration, DataTypes, done) {

        migration.addColumn(
            'Department',
            'path',
            {
                type: DataTypes.STRING
            }
        );

        migration.addColumn(
            'Department',
            'level',
            {
                type: DataTypes.INTEGER
            }
        ).complete(done);
    },

    down: function(migration, DataTypes, done) {
        // logic for reverting the changes
        done() // sets the migration as finished
    }
}