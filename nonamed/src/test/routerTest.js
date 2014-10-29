'use strict';

var superagent = require('superagent')
var expect = require('expect.js')

describe('express rest api server', function() {

    it('조직도 트리를 가져온다', function (done) {
        superagent.get('http://localhost:3000/depts')
            .send({ deptCode: '1'})
            .end(function (e, res) {
                console.log(res)
                done()
            })
    })
});