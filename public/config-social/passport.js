var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    gcal = require('google-calendar');
    LocalStrategy = require('passport-local').Strategy;

var configAuth = require('./auth');
var client = require("../../routes/config/pg.js");

module.exports = function(passport) {

    // Serializa al usuario para almacenarlo en la sesión
    passport.serializeUser(function(user, done) {
        done(null, user.u_email);
    });

    /* Deserializa el usuario almacenado en la sesión para
     poder utilizarlo*/
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('Calendar', new TwitterStrategy))

    passport.use( new GoogleStrategy({
        clientID: configAuth.calendarAuth.clientID,
        clientSecret: configAuth.calendarAuth.clientSecret,
        callbackURL: '/auth/calendar/callback',
        scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        return done(null, profile);
    }));

    // =========================================================================
    // GOOGLE CONFIGURACION ====================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        client.query("SELECT * FROM app_kanban.users WHERE u_email = ($1)",[profile.emails[0].value], function(err, result) {
                if (err)
                    return done(err);
                if (result.rows.length) {
                    return done(null, result.rows[0]);
                } else {
                    // si el usuario existe lo devuelve
                    // si no, lo crea y guarda en la base de datos
                    var newUserMysql = {
                        users_email: profile.emails[0].value,
                        users_username: profile.name.givenName,
                        users_surname: profile.name.familyName,
                        users_photo: profile.photos[0].value
                    };

                    var insertQuery = "INSERT INTO app_kanban.users (u_email, u_username, u_surname, u_photo ) VALUES ($1,$2,$3,$4)";

                    client.query(insertQuery,[newUserMysql.users_email , newUserMysql.users_username, newUserMysql.users_surname, newUserMysql.users_photo],function(err, result) {
                         if (err) {
                            console.log(err);
                          }else{
                            return done(null, newUserMysql);
                          }

                    });
                }
            });
    }));


    // =========================================================================
    // AUTENTICACION Y CONFIGURACION LOCAL =====================================
    // =========================================================================
    passport.use('local-login',new LocalStrategy(
      function(username, password, done) {
        client.query("SELECT * FROM app_kanban.users WHERE u_email = ($1) AND u_password = ($2)",[username, password], function(err, result) {
            if (err)
                return done(null, false);
            if (result.rows.length) {
                return done(null, result.rows[0]);
            }else{
                return done(null, false, {message: "El usuario o la contraseña es incorrecto. Intente nuevamente.."});
            }
        });
      }
    ));

    // =========================================================================
    // REGISTRACION Y CONFIGURACION LOCAL =====================================
    // =========================================================================
    passport.use('local-signup',new LocalStrategy({
      passReqToCallback: true
    },
      function(req, username, password, done) {

         client.query("SELECT * FROM app_kanban.users WHERE u_email = ($1)",[username], function(err, result) {
            if (err){
                  console.log("ERROOOOOOOOOOOOOOOR: " );
                 return done(null, false);
               }
             if (result.rows.length) {
               console.log("El usuario ya existe.." );
               return done(null, false, {message: "El usuario ya existe.."});
                 //return done(null, result.rows[0]);
             }else{

               console.log("Registrando...  " );
                   var newUserMysqlReg = {
                       u_email: username,
                       users_username: 'Invitado',
                       users_surname: 'Invitado',
                       users_password: password
                   };

                   var insertQuery = "INSERT INTO app_kanban.users (u_email, u_username, u_surname, u_password ) VALUES ($1,$2,$3,$4)";

                   client.query(insertQuery,[newUserMysqlReg.u_email , newUserMysqlReg.users_username, newUserMysqlReg.users_surname, newUserMysqlReg.users_password],function(err, result) {
                        if (err) {
                           console.log(err);
                         }else{
                           return done(null, newUserMysqlReg);
                         }
                   });
             }
         });
       }
    ));


};
