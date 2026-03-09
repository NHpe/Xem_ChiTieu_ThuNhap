const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/User');
const passport = require('passport');

// Cấu hình Passport để sử dụng JWT
const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
}

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET || 'test_secret_key'
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
}));

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = authenticate;