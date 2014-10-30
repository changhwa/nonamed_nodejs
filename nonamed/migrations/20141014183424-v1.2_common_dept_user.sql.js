/**
 * CREATE TABLE IF NOT EXISTS `Departmentusers`
 * (`user_code` VARCHAR(20) ,
 * `department_code` VARCHAR(20) ,
 * PRIMARY KEY (`user_code`, `department_code`),
 * FOREIGN KEY (`user_code`) REFERENCES `users` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
 * FOREIGN KEY (`department_code`) REFERENCES `Department` (`code`) ON DELETE CASCADE ON UPDATE CASCADE)
 * ENGINE=InnoDB;
 */

module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable(
            'dept_user',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                user_code: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    references: "users",
                    referencesKey: "code"
                },
                department_code: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    references: "Department",
                    referencesKey: "code"
                }
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