module.exports =   // it makes this file exportable so as to use database and port in other files
    {
        // database: 'mongodb+srv://root:123abc@codedemy-tvncz.mongodb.net/test?retryWrites=true&w=majority',
        database: 'YOUR_DB',
        port: 8000,
        secretKey: 'SECRET',

        facebook: {
            clientID: 'YOUR_CLIENT_ID',
            clientSecret: 'YOUR_CLIENT_SECRET',
            profileFields: ['emails', 'displayName'],
            callbackURL: 'http://localhost:8000/auth/facebook/callback',
            passReqToCallback: true,
        }
    }
