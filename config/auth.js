//export our config directly to out application using module.exports
module.exports = {
    
    //facebook
    'facebookAuth':{
        //對應的是facebook developers - setting的應用程式編號、應用程式密鑰
        //your App ID
        'clientID':'1129429473845626',
        //your AppSecret
        'clientSecret':'37f76cdcabdb6f469d44b9a1b7d69d78',
        'callbackURL':'http://localhost:3000/auth/facebook/callback'
    },
    
    //google
    'googleAuth':{
        'clientID':'',
        'clientSercet':'',
        'callbackURL':'http://localhost:3000/auth/google/callback'
    }
};