const request = require('supertest');
const assert = require('assert');
const app = require('./app');
const validate = require('validate.js');
const authValidation = require('../validates/auth.validate');

// describe('POST /api/register regist success', function() {
//     it('should authenticate a user with correct credentials', function(done) {
//         request(app)
//             .post('/auth/register')
//             .send({ username: 'lantran', password: '11111' })
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 const res_expect = {
//                     "auth": true,
//                     "message": "User registered"
//                 };

//                 assert.strictEqual(res.body.auth, true);
//                 assert.deepEqual(res.body, res_expect, "Authentication successful");
//                 done();
//             });
//       });
// });

const emptyAuthen = { username: null, password: null };
const blankAuthen = { username: '', password: '' };
const invalidTestcases = [
    {
        keyword: 'username',
        expectmessage: 'Username is too short (minimum is 3 characters)',
        username: "la",
        password: "11111"
    },
    {
        keyword: 'password',
        expectmessage: 'Password is too short (minimum is 5 characters)',
        username: "lanlanlanlan",
        password: "111"
    },
    {
        keyword: 'password',
        expectmessage: 'password is too long', // correct message: Password is too long (maximum is 10 characters)
        username: "lanlanlanlan",
        password: "11111111111"
    }
]
const correctLogin = { username: 'lantran', password: '11111' };
const wrongLogin = { username: 'lantran', password: '22222' };
const noneExist = { username: 'abcdef', password: '22222' };

describe('POST /api/auth empty authentication', function() {
    it('should authenticate a empty request', function(done) {
        request(app)
            .post('/auth/login')
            .send(emptyAuthen)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.auth, false);
                assert('errors' in res.body, 'Key "errors" is the response');
                done();
            });
      });
});

describe('POST /api/auth blank authentication', function() {
    it('should authenticate a blank request', function(done) {
        request(app)
            .post('/auth/login')
            .send(blankAuthen)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.auth, false);
                assert('errors' in res.body, 'Key "errors" is the response');
                done();
            });
    });
});

describe('POST /api/auth input validation of authentication', function() {

    invalidTestcases.forEach(testcase => {
        it('should authenticate the invalid inputs', function(done) {
            request(app)
                .post('/auth/login')
                .send(testcase)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    assert('errors' in res.body, 'Key "errors" is the response');

                    const errors = validate(testcase, authValidation.login);
                    if (errors) {
                        assert.strictEqual(res.body.auth, false);
                        assert(testcase.keyword in res.body.errors, `Key ${testcase.keyword} is the response ${res.body.errors[testcase.keyword]}`);
                        assert(res.body.errors[testcase.keyword].includes(testcase.expectmessage), `Actual: ${res.body.errors[testcase.keyword]} - Expect: ${testcase.expectmessage}`);
                    }

                    done();
                });
        });

    });

});

describe('POST /api/auth success authentication', function() {
    it('should authenticate a user with correct credentials', function(done) {
        request(app)
            .post('/auth/login')
            .send(correctLogin)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.auth, true);
                assert.strictEqual(res.body.message, 'Login success', `Actual: ${res.body.message} - Expect: Buthentication successful`);
                done();
            });
      });
});

describe('POST /api/auth incorrect authentication', function() {
    it('should authenticate a user with incorrect credentials', function(done) {
        request(app)
            .post('/auth/login')
            .send(wrongLogin)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.auth, false);
                assert('errors' in res.body, 'Key "errors" is the response');
                assert.strictEqual(res.body.errors.message, 'Invalid password');
                done();
            });
      });
});

describe('POST /api/auth none exist authentication', function() {
    it('should authenticate an none exist user', function(done) {
        request(app)
            .post('/auth/login')
            .send(noneExist)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.auth, false);
                assert('errors' in res.body, 'Key "errors" is the response');
                assert.strictEqual(res.body.errors.message, 'User not found');
                done();
            });
      });
});
