const passwordValidator = require('password-validator');
const validator = require('validator');

const isValidEmail = (email) => validator.isEmail(email);

const isValidPassword = (password) => {
  // eslint-disable-next-line new-cap
  const schema = new passwordValidator();

  schema
    .is().min(7)
    .is().max(20)
    .has()
    .letters()
    .has()
    .digits()
    .has()
    .symbols();

  return schema.validate(password);
};

module.exports = {
  isValidEmail,
  isValidPassword,
};
