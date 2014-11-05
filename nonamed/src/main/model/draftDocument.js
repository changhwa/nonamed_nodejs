"use strict";

module.exports  = function(sequelize, DataTypes) {
    var ApprovalLine = sequelize.import(__dirname + "/approvalLine");
    var DraftDocument = sequelize.define("DraftDocument", {
        docUid: {
            //type: DataTypes.STRING,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            //allowNull: false,
            primaryKey: true
        },
        subject: DataTypes.STRING,
        contents : DataTypes.STRING
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