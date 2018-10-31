# React Client and Express REST API for Microblog and Azure Table Storage

1. Create `start.sh`
1. Add Azure key and storage name to `start.sh` in the following format: `AZURE_STORAGE_ACCOUNT=name AZURE_STORAGE_ACCESS_KEY=key node app.js`
1. Repeat step 2 for `test.sh`: `AZURE_STORAGE_ACCOUNT=name AZURE_STORAGE_ACCESS_KEY=key ./node_modules/mocha/bin/mocha app.test.js`
1. Run `npm i`
1. Run `npm test` to test with Azure (first time you run it, it will create table so run it again)
1. Run `npm start` to start the server on 3000 with connection to Azure
