"use strict";

module.exports  = function(sequelize, DataTypes) {
    var snsMessageAuth =  sequelize.define("snsMessageAuth", {
        auth_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        auth_target: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        sns_message_msg_id:{
            type: DataTypes.INTEGER,
            references: "sns_message",
            referencesKey: "msg_id",
            onDelete: 'cascade'
        }
    },{
        underscored: true,
        timestamps: false,
        tableName: 'sns_message_auth'
    });

    return snsMessageAuth;
};




