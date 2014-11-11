"use strict";

module.exports  = function(sequelize, DataTypes) {
    var ApprovalLine =  sequelize.define("ApprovalLine", {
        /* 결재선 고유아이디 */
        approvalLineUid: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        /* 결재자 아이디 */
        approverEmail: DataTypes.STRING,

        /* 결재자 성명 */
        approverName : DataTypes.STRING,

        /* 결재자 직책 or 직위 */
        approverPositionOffice : DataTypes.STRING,

        /* 결재자 순서 */
        approverOrder : DataTypes.STRING,

        /* 결재자 구분 */
        approverType : DataTypes.STRING,

        /* 결재자 구분명 */
        approverTypeName : DataTypes.STRING,

        /* 결재자 처리일 */
        approverPrcDate : DataTypes.DATE,

        /* 결재자 결재코드 */
        approverAppCd : DataTypes.STRING,

        /* 결재자 결재코드명 */
        approverAppCdName : DataTypes.STRING,

        /* 문서 고유아이디 */
        docUid : DataTypes.UUID
    },{
        underscored: true,
        timestamps: false,
        tableName: 'approvalLine',
        classMethods:{
            associate:function(models){
                ApprovalLine.belongsTo(models.DraftDocument, {
                    foreignKey: 'docUid'
                });
            }
        }
    });

    return ApprovalLine;
};