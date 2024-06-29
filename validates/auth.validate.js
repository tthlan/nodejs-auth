module.exports = {
    register: {
        username: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        password: {
            presence: { allowEmpty: false },
            length: { minimum: 5, maximum: 10 }
        }
    },
    login: {
        username: {
            presence: { allowEmpty: false },
            length: { minimum: 3 }
        },
        password: {
            presence: { allowEmpty: false },
            length: { minimum: 5, maximum: 10 }
        }
    }
};