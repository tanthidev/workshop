const bcrypt = require('bcrypt');

function hashPassword(password){
  const saltRounds = 10; // Cost factor for hashing

    var passwordhashed;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {

        } else {
          passwordhashed = hash
        }
      });
    return passwordhashed;
}

module.exports = hashPassword