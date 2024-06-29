const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('validate.js');
const authValidation = require('../validates/auth.validate');

require('dotenv').config();

const User = require('../models/user');

exports.register = async (req, res) => {
  const errors = validate(req.body, authValidation.login);
  if (errors) {
    return res.status(400).send({ auth: false, errors});
  }

  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(5);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({ username, password: hashedPassword });
    res.status(201).send({ auth: true, message:'User registered' });

  } catch (error) {
    res.status(500).send({ auth: false, errors: error });
  }
};

exports.login = async (req, res) => {
  const errors = validate(req.body, authValidation.login);
  if (errors) {
    return res.status(400).send({ auth: false, errors});
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ auth: false, errors: {message: 'User not found'} });

    const validPassword = await bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ auth: false, errors: {message: 'Invalid password'} });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).send({ auth: true, message: 'Login success', token });

  } catch (error) {
    res.status(500).send({ auth: false, errors: error });
  }
};

exports.me = async (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided' });

  try {
    let data = null;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
      data = decoded;
    });

    const user = await User.findOne({ where: { id: data.id } });
    if (!user) {
      return res.status(404).send({ auth: false, message: 'User not found' });
    } else {
      res.status(200).send({
        auth: true,
        data: { "id": user.id, "username": user.username } ,
        message: 'Validated token success'
      });
    }

  } catch (error) {
    res.status(500).send({ auth: false, errors: error });
  }
};

exports.test = (req, res) => {
  res.status(200).send('test');
}

