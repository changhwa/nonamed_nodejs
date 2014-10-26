"use strict";

module.exports  = function(sequelize, DataTypes) {
    var DraftDocument =  sequelize.define("DraftDocument", {
        docUid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        subject: DataTypes.STRING,
        contents : DataTypes.STRING
    },{
        underscored: true,
        timestamps: false,
        tableName: 'draftDocument'
    });
    return DraftDocument;
};