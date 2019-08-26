# Blockchain Document Management System

Simple document management system with Hyperledger Fabric blockchain using Hyperledger Composer API, IPFS, MongoDB, Express.js, GraphQL, React.js and Material-UI

[![Watch the video](https://img.youtube.com/vi/-0jr5HwS16g/maxresdefault.jpg)](https://youtu.be/-0jr5HwS16g)

## Prerequisite

- Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
- [Docker](https://www.docker.com/) (version 17.03 or higher)
- [npm](https://www.npmjs.com/)  (v5.x)
- [Node](https://nodejs.org/en/) (version 8.9 or higher - note version 9 is not supported!)
  * to install specific Node version you can use [nvm](https://github.com/creationix/nvm). Example:
    + `nvm install 8.12.0`
    + `nvm use v8.12.0`
- [Hyperledger Composer](https://hyperledger.github.io/composer/installing/development-tools.html)
  * to install composer cli
    `npm install -g composer-cli@0.20`
  * to install composer-rest-server
    `npm install -g composer-rest-server@0.20`
  * to install generator-hyperledger-composer
    `npm install -g generator-hyperledger-composer@0.20`
- [IPFS](https://ipfs.io/)  (v0.4.17 or higher)
- [MongoDB](https://www.mongodb.com/)
  * for example you can use cloud hosted MongoDB by [mlab.com](https://mlab.com)

## Steps
### 1. Clone the repository

Clone the `Blockchain Document Managemen System` repo locally. In a terminal, run:
```
git clone https://github.com/nparfen/Blockchain-Document-Management-System.git
```

### 2. Deploy the network

Start Docker. The fabric setup scripts will be in the `/fabric` directory. Start fabric and create peer admin card:
```
cd fabric/
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```

Now, we are ready to deploy the business network to Hyperledger Fabric. This requires the Hyperledger Composer chaincode to be installed on the peer,then the business network archive (.bna) must be sent to the peer, and a new participant, identity, and associated card must be created to be the network administrator. Finally, the network administrator business network card must be imported for use, and the network can then be pinged to check it is responding.

* Generate a business network archive in the `root` of the project:
```
cd ../
composer archive create -t dir -n .
```

* Install the business network:
```
composer network install --card PeerAdmin@hlfv1 --archiveFile nykredit-network@0.0.1.bna
```

* Start the business network:
```
composer network start --networkName nykredit-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
```

* Import the network administrator identity as a usable business network card:
```
composer card import --file networkadmin.card
```

* Check that the business network has been deployed successfully, run the following command to ping the network:
```
composer network ping --card admin@nykredit-network
```

If the command returns successfully, your setup is complete.

### 3. Run IPFS

```
ipfs init
ipfs daemon
```

### 4. Run Application

Go into the `api` folder and install the dependency:
```
cd api/
npm install
```

Connect your mongodb instance to save data about transactions for filtering, searching and paginating. Create `.env` file in the `api` folder and fill it with yours values. Also put down JWT secret for JWT token and enter preffered port for the server.
```
APP_PORT=
JWT_SECRET=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=
```

Then run the server:
```
npm start
```

If evetything is okay you will see two links of the server (basic and for websockets).

Go to the `client` folder and install the dependency:
```
cd client/
npm install
```

In the `client` folder create `.env` file and put that server links.
```
REACT_APP_API=
REACT_APP_WEBSOCKET=
```

Then start the web application:
```
npm start
```

The application should now be running at:
`http://localhost:3000`