process.env.NODE_ENV = 'test';
var Authentication = require('../controllers/authentication')
, fs = require('fs');
var testData;
var testData1;
//setup chai
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();
chai.use(chaiHttp);
//User model
const User = require('../models/user');
//Authentication Tests
describe('Authentication Tests', function(){
  this.timeout(15000);
  describe('Sign up new user API-"/signup" Request type - "POST"', () => {
    beforeEach(function(done) {
      fs.readFile('./test/fixtures/users/useralreadyexists.json', 'utf8', function(err, data) {
          if (err) { return done(err); }
          testData = JSON.parse(data);
          done();
        });
      });
      it('Return status code 200 if user is added to Users collections', function(done){
        User.findOneAndRemove({"email":testData["email"]},function (err, user) {
          if (err) {
              console.log("User not found");
              console.log(err)
          }
        });
        chai.request(server)
            .post('/signup')
            .send(testData)
            .end((err, res) => {
                console.log(res.status);
                res.should.have.status(200);
              done();
            });
        });
        it('Return status code 423 when user already exists', function(done){
          chai.request(server)
              .post('/signup')
              .send(testData)
              .end((err, res) => {
                  console.log(res.status);
                  res.should.have.status(423);
                done();
              });
            });
        it('Sign in with this user', function(done){
          chai.request(server)
              .post('/signin')
              .send(testData)
              .end((err, res) => {
                  console.log(res.status);
                  res.should.have.status(200);
                done();
              });
            });
  });
  describe('Sign in with a user which does not exists API-"/Signin" Request type - "POST"', () => {
    beforeEach(function(done){
      fs.readFile('./test/fixtures/users/userdoesnotexists.json', 'utf8', function(err, data) {
          if (err) { return done(err); }
          testData = JSON.parse(data);
          done();
        });
      });
      it('Return status code 401 when user does not exists', (done) => {
        User.findOneAndRemove({"email":testData["email"]},function (err, user) {
          if (err) {
              console.log("User not found");
              console.log(err)
          }
        });
        chai.request(server)
            .post('/signin')
            .send(testData)
            .end((err, res) => {
                console.log(res.status);
                res.should.have.status(401);
              done();
            });
          });
    });
});
