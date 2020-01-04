module.exports =   // it makes this file exportable so as to use database and port in other files
    {
        // database: 'mongodb+srv://root:123abc@codedemy-tvncz.mongodb.net/test?retryWrites=true&w=majority',
        database: 'mongodb://root:123abc@codedemy-shard-00-00-tvncz.mongodb.net:27017,codedemy-shard-00-01-tvncz.mongodb.net:27017,codedemy-shard-00-02-tvncz.mongodb.net:27017/test?ssl=true&replicaSet=Codedemy-shard-0&authSource=admin&retryWrites=true&w=majority',
        port: 8000,
        secretKey: 'Yanik2103',

        facebook: {
            clientID: '2343953218996866',
            clientSecret: 'b73236b00b5867c189bf221b857c646b',
            profileFields: ['emails', 'displayName'],
            callbackURL: 'http://localhost:8000/auth/facebook/callback',
            passReqToCallback: true,
        }
    }