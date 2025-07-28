const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const userQueries = require('./queries/userQueries');

module.exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  try {
    const foundUser = await userQueries.findUser({ email });
    const { id: userId, accessToken, ...userWithoutId } = foundUser;

    await userQueries.passwordCompare(password, foundUser.password);
    const newToken = jwt.sign(
      {
        ...userWithoutId,
        userId,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken: newToken }, userId);

    res.send({ token: newToken });
  } catch (err) {
    next(err);
  }
};
module.exports.registration = async (req, res, next) => {
  const { hashPass, body } = req;

  try {
    const newUser = await userQueries.userCreation({
      ...body,
      password: hashPass,
    });
    const { id: userId, ...userWithoutId } = newUser;

    const accessToken = jwt.sign(
      {
        ...userWithoutId,
        userId,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken }, userId);

    res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const {
    file,
    body,
    tokenData: { userId },
  } = req;

  try {
    if (file) {
      body.avatar = file.filename;
    }
    const updatedUser = await userQueries.updateUser(body, userId);
    res.send({
      ...updatedUser,
    });
  } catch (err) {
    next(err);
  }
};