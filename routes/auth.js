const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')
const User = require('../models/User')
const router = express.Router()

// Get user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch(err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// User login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()})
  }

  const {email, password} = req.body

  try {
    let user = await User.findOne({email})

    if(!user) {
      return res
        .status(400)
        .json({msg: 'Invalid Credentials.'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
      return res
        .status(400)
        .json({msg: 'Invalid Credentials.'})
    }

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
    res.status(500).send('Sever Error')
  }
})

module.exports = router