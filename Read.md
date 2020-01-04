Start Project
mkdir [project name]
npm init
npm install express mongoose morgan body-parser --save
create a new file server.js

Make config folder and add secret.js so that we can put all secret files in that and export from there.
routes folder includes routes path i.e app urls.
models include the modelling an structure which is included what it contains. define model and 
install ejs and ejs-mate for templating engine to make view of web
setup the template and then move to authentication by facebook
setup a new app in faceboook developers and then place Clientid and clientSecret in secret.js but 
we need to install couple of libraries i.e. passport-facebook and passport
setup passport facebook strategy in config
after passport strategy 
install npm install express-session