const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'Segredo!';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, async (payload, done) => {
    const user = await app.services.users.findOne({ id: payload.id });

    try {
      if (user) return done(null, { ...payload });
      else return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
