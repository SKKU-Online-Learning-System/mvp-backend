import crypto from 'crypto';
import LocalStrategy from 'passport-local'

import { DB_promisePool as db, hashSettings, Err, statusJson } from './../configs';

// Local Strategy using passport
const passportConfig = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',  // req.body.email
                passwordField: 'password', // req.body.password
            },
            async (email, password, done) => {
                try {
                    const [user] = await db.query('SELECT * FROM user WHERE email = ?', [email]); // [{row}, {row}, {row}]
                    if (!user)
                        return done(null, false, {
                            message: 'No registered user!'
                        }); // no registered user in DB
                    const salt = user[0].salt;
                    const key = crypto.pbkdf2Sync(password, salt, hashSettings.iterations, hashSettings.keylen, hashSettings.digest).toString(hashSettings.encoding);
                    if (key === user[0].password)
                        return done(null, user); // login success
                    else
                        return done(null, false, {
                            message: 'Incorrect username or password!'
                        }); // incorrect username or password
                } catch(err) {
                    return done(err); // error while fetching query
                }
            }
        )
    );

    // Serialize user (while signing in)
    passport.serializeUser((user, done) => {
        done(null, user[0].id);
    });

    // Deserialize user (every single request)
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.query('SELECT * FROM user WHERE id = ?', [id]);
            done(null, user[0]);
        } catch(err) {
            done(err);
        }
    });
};

export default passportConfig;