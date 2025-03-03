const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../db/models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  try {
    const foundUser = await userQueries.findUser({ email });
    const { id: userId, ...userWithoutId } = foundUser;

    await userQueries.passwordCompare(password, foundUser.password);
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