# dapps-tutorial-angular
This tutorial shows how to develop DApps using Angular 5 and the evan.network framework. For detailed information and instructions have a look here: 
[evannetwork.github.io](https://evannetwork.github.io/dapps/angular-hello-world)

## Install
- you very likely will need `nvm` installed
- you definitely need `lerna` and `gulp` installed

```bash
npm install
lerna bootstrap --hoist
```

## Basic Development
- build and serve the local dapp serve
- starts an local server at http://localhost:3000/dev.html
```bash
npm run serve
```

- build all dapps
```bash
npm run dapps-build
```

- serve for change tracking
```bash
npm run dapps-serve
```

## Deploy to contract
- start ipfs deamon connected to evan.network ipfs before deploying
```bash
./scripts/go-ipfs.sh
```
- create a new contract and reference your dapp
```bash
npm run deploy-to-contract hello-world
```

## Deploy to ENS

Have a look at the [deployment description](https://evannetwork.github.io/dev/deployment).