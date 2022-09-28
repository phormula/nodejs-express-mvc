const mailHelper = require('./mail');
const tokenHelper = require('./token');

function protectedUser(userObj) {
  const fields = ['password', 'email_verified_at', 'updated_at'];

  fields.forEach((e) => {
    delete userObj[e];
  });

  return userObj;
}

function getCommonIds(arr1, arr2) {
  return arr1.map((e) => e.id).filter((el) => arr2.map((ele) => ele.id).includes(el));
}

module.exports = { mailHelper, tokenHelper, protectedUser, getCommonIds };
