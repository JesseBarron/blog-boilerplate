const router = require('@feathersjs/express').Router()
const passport = require('passport')
// const { User } = require('../db')
const app = require('../index')
module.exports = router


router.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    try {
        if(req.user.admin) {
            res.send(await app.service('user').find())
        } else {
            res.status(401).send('User is Unauthorized')
        }
    } catch(e) {
        console.log(e)
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const newUser = req.body
        const createdUser = await app.service('user').create(newUser)
        res.send(createdUser)
    } catch(e) {
        console.log(e)
        res.send("Error")
    }
})

router.delete('/', passport.authenticate('jwt',{session: false}), async (req, res, next) => {
    try {
        // Add the option for users to delete their own accounts if they wish.
        if(req.user.admin) {
            const where = req.body
            res.send(await app.service('user').remove(null, where))
        }
    } catch(e) {
        console.log(e)
        next(e)
    }
})