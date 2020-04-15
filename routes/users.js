const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const router = express.Router()

// User signup
router.post('/signup', [
  check('name', 'Name is required.').not().isEmpty(),
  check('email', 'Email is required.').isEmail(),
  check('password', 'Please enter a password with 6 or more characters.').isLength({min: 6})
], async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()})
  }

  const {name, email, password} = req.body

  try {
    let user = await User.findOne({email})

    if(user) {
      return res
        .status(400)
        .json({msg: 'User already exists.'})
    }

    user = new User({
      name,
      email,
      password               
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 3600
    }, (err, token) => {
      if(err) throw err
      res.json({token})
    })      
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router