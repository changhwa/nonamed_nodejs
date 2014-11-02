'use strict';

var model = require("../../main/model/index");
var Sequelize = require('sequelize');

//TODO : Test Case Refactoring
describe('SNS TEST', function () {
    describe('SNS MESSAGE TEST', function(){
        before(function(done){
            model.snsMessage.sync({force: true}).then(function(){
                return model.snsMessage.build({
                    msg_id: 1,
                    msg_writer: 'ea11111111',
                    msg_content:'Test Message 1',
                    create_date: '2014-11-02 16:42:20',
                    update_date: '2014-11-02 16:42:20'
                }).save();
            }).then(function(){
                done();
            });
        });
        after(function(done){
            model.snsMessage.drop({
                force: true,
                cascade: false
            }).then(function(){
                done();
            });
        });

        it('should get sns message find by msg_id', function (done) {
            this.timeout(1000);
            model.snsMessage.find({where: {msg_id: 1}}).then(function(sns){
                sns.dataValues.msg_id.should.equal(1);
                sns.dataValues.msg_writer.should.equal('ea11111111');
                //console.log (sns.dataValues);
                done();
            });
        });

        it('should save sns message', function(done){
            this.timeout(1000);
            model.snsMessage.build({
                msg_id: 2,
                msg_writer: 'ea11111111',
                msg_content:'Test Message 2',
                create_date: '2014-11-02 17:44:22'
            }).save().then(function(){
                return model.snsMessage.find({where: {msg_id: 2}});
            }).then(function(sns){
                sns.dataValues.msg_id.should.equal(2);
                sns.dataValues.msg_writer.should.equal('ea11111111');
                //console.log (sns.dataValues);
                done();
            });
        });

        it('should update sns message by update_date and msg_content', function(done){
            this.timeout(1000);
            var beforeDt;
            var beforeContent;
            model.snsMessage.find({where: {msg_id: 2}}).then(function(sns){
                beforeDt = sns.dataValues.update_date;
                beforeContent = sns.dataValues.msg_content;
                sns.update_date = new Date();
                sns.msg_content = 'Update Message 2';
                return sns.save();
            }).then(function(){
                return model.snsMessage.find({where: {msg_id:2}})
            }).then(function(testResult){
                var _sns = testResult.dataValues;
                _sns.update_date.should.not.equal(beforeDt);
                _sns.msg_content.should.not.equal(beforeContent);
                done();
            });
        });

        it('should delete sns message by msg_id', function(done){
            this.timeout(1000);
            model.snsMessage.find({where: {msg_id: 2}}).then(function(sns){
                return sns.destroy();
            }).then(function(){
                "1".should.equal("1");
                done();
            }).catch(function(){
                "1".should.equal("2");
                done();
            });
        });
    });
    describe('SNS MESSAGE AUTH TEST', function(){
        before(function(done){
            model.snsMessage.sync({force: true}).then(function(){
                return model.snsMessage.build({
                    msg_id: 1,
                    msg_writer: 'ea11111111',
                    msg_content:'Test Message 1',
                    create_date: '2014-11-02 16:42:20',
                    update_date: '2014-11-02 16:42:20'
                }).save();
            }).then(function(){
                return model.snsMessageAuth.sync({force: true});
            }).then(function(){
                return model.snsMessageAuth.build({
                    auth_id: 1,
                    auth_target: 'ea11111111',
                    sns_message_msg_id:1
                }).save();
            }).then(function(){
                done();
            });
        });
        after(function(done){
            model.snsMessageAuth.drop().then(function(){
                return model.snsMessage.drop();
            }).then(function(){
                done();
            })
        });

        it('should get sns message find by require auth',function(done){
            this.timeout(1000);
            model.snsMessage.find({include:[{model: model.snsMessageAuth, required: true}] }).then(function(sns){
                sns.dataValues.snsMessageAuths.length.should.equal(1);
                done();
            })
        });

        it('should get all sns message find by auth_target', function(done){
            this.timeout(1000);
            model.snsMessage.findAll({
                include: [{
                    model: model.snsMessageAuth,
                    where: {auth_target: 'ea11111111'},
                    required: true
            }]}).then(function(sns){
                sns.length.should.above(0);
                sns[0].dataValues.snsMessageAuths.length.should.equal(1);
                done();
            });
        });

        it('should save sns message and sns message auth', function(done){
            this.timeout(1000);
            model.snsMessage.build({
                msg_id: 2,
                msg_writer: 'eb11111111',
                msg_content:'Test Message 2'
            }).save().then(function(sns){
                return sns.addSnsMessageAuth(model.snsMessageAuth.build({
                    auth_target: 'ea11111111'
                }));
            }).then(function(auth){
                auth.dataValues.auth_id.should.equal(2);
                done();
            })
        });

        it('should save sns message and multiple sns message auth', function(done){
            this.timeout(1000);
            var user = "eb11111111,ec11111111";
            var userArr = user.split(",");
            model.snsMessage.build({
                msg_id: 3,
                msg_writer: 'ea11111111',
                msg_content:'Test Message 3'
            }).save().then(function(sns){
                var json = {};
                var jsonArr = [];
                for(var i=0;i<userArr.length;i++){
                    json.auth_target = userArr[i];
                    json.sns_message_msg_id = sns.dataValues.msg_id;
                    jsonArr.push(json);
                }
                return model.snsMessageAuth.bulkCreate(jsonArr);
            }).then(function(){
                return model.snsMessage.findAll({
                    include: [{
                        model: model.snsMessageAuth,
                        required: true
                    }]});
            }).then(function(sns){
                sns.length.should.above(0);
                sns[2].dataValues.snsMessageAuths.length.should.equal(2);
                done();
            });
        });
    })
});
