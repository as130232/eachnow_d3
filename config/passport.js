var FacebookStrategy = require('passport-facebook').Strategy;

var Member = require('../app/models/member');

var configAuth = require('./auth');


module.exports = function (passport) {

    //序列化 存Member資料
    passport.serializeUser(function (member, done) {
        done(null, member._id);
    });
    //反序列化 取出Member資料
    passport.deserializeUser(function (id, done) {
        Member.findById(id, function (err, member) {
            done(err, member);
        });
    })

    //Facebook Strategy(get config/passport-facebookAuth setting's value)
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            //跟facebook要求哪些profile的資料
            profileFields: ['id', 'emails', 'displayName']
        },
        //verify success after callback 
        /*
          token: 與facebook再溝通的令牌
          profile: facebook回傳的用戶資料
        */
        function (token, refreshToken, profile, done) {
            //會員collection中找尋是否有該帳戶
            Member.findOne({
                'facebook': profile.id
            }, function (err, member) {
                if (err) {
                    console.log('DB error');
                    return done(err);
                }
                //若有該會員
                if (member) {
                    return done(null, member);
                }
                //無該會員，在DB建立一筆資訊
                else {
                    var newMember = new Member();
                    console.log('profile:' + profile);
                    newMember.facebook = profile.id;
                    newMember.token = token;
                    //facebook會回傳多個email
                    newMember.email = profile.emails[0].value;
                     //look at the passport user profile to see how names
                    newMember.profile.username = profile.displayName;
                    newMember.profile.picture = 'https://graph.facebook.com/' + profile.id + 'picture?width=20';
                    //save our member to the database

                    newMember.save(function (err) {
                        if (err) {
                            console.log('save error');
                            throw err;
                        }
                        //if succesful, return the new user
                        console.log('--add new Member success.' + newMember);
                        return done(null, newMember);
                    });
                }
            });

        }
    ));
}