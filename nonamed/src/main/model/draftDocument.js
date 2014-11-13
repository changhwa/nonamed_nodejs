"use strict";

module.exports  = function(sequelize, DataTypes) {
    var ApprovalLine = sequelize.import(__dirname + "/approvalLine");
    var DraftDocument = sequelize.define("DraftDocument", {
        docUid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        subject: DataTypes.STRING,
        contents: DataTypes.STRING,
        distributionType: DataTypes.STRING,
        docStatus: DataTypes.STRING
    },{
        underscored: true,
        timestamps: false,
        tableName: 'draftDocument',
        classMethods:{
            associate:function(models){
                DraftDocument.hasMany(models.ApprovalLine, {
                    as: 'ApprovalLine',
                    foreignKey: 'docUid'
                });
            }
        }
    });

    return DraftDocument;
};