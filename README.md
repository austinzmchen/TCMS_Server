# TCMS_Server

```
tsc -p tsconfig.json

node dist/app.js
```

```
// sometimes ubuntu does not have the latest nodejs installed, even after apt-get install
// https://joshtronic.com/2017/10/20/upgrade-to-nodejs-8-on-ubuntu-1710/

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs
node --version

// solve an error
ln -s /usr/bin/nodejs /usr/bin/node
```