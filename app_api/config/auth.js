// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_ID, // your App ID
        'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
        'callbackURL'   : 'https://profinder1.herokuapp.com/api/auth/facebook/callback'
    }

};