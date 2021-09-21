# Yay back-end

### Scripts
`npm start` - Starts the application

`npm run serve` - Runs the application in development mode (hot reload)

### Environment File - src/.env
`MONGO_URI` - Mongo connection URI ie "mongodb://127.0.0.1:27017/db-bridge"

`PORT` - App port number

`ETHEREUM_WALLET_PRIVATE_KEY` - Ethereum hot wallet private key

`SERVER_URL` - Current server ip

`INFURA_KEY` - Infura API KEY

`FEE` - Set Fixed Fee(Should be same in frontend)

### Deployment
1. Install node ^14.16.0 and pm2
2. Install typescript globally
3. Run `tsc` and it will generate `/dist` folder.
4. Copy src/.env and paste it in `/dist` folder.
5. `pm2 start ./dist/app.js --name backend` and it will run the app on port 8000.
6. Call `POST http://${SERVER_URL}:${PORT}/create-wallet` using Postman or Curl. 

### Setup cronjob to check 
`* * * * * /root/.nvm/versions/node/v14.16.0/bin/node /root/yay-bridge-backend/dist/controllers/script.js >> ~/cron.log 2>&1`
It will check all awaiting requests in db and check the balance of specific wallet balance each min.

