"use strict";

module.exports  = function(sequelize, DataTypes) {
    var snsMessage =  sequelize.define("snsMessage", {
        msg_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        msg_writer: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        msg_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue : sequelize.fn('NOW')
        },
        update_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue : sequelize.fn('NOW')
        },
        secretYn : {
            type: DataTypes.STRING(1),
            defaultValue: 'Y'
        }
    },{
        underscored: true,
        timestamps: false,
        tableName: 'sns_message',
        "classMethods" : {
            "associate" : function (models) {
                models.snsMessage.hasMany(models.snsMessageAuth);
            }
        }
    });

    return snsMessage;
};



