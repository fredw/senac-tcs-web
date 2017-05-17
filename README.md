Water Reservoir Web
================================================================================
[![Codeship Status for fredw/senac-tcs-web](https://app.codeship.com/projects/ea1fa610-1980-0135-1f15-7e4720114d12/status?branch=master)](https://app.codeship.com/projects/219312)


Build Setup
------------------------------------------------------------

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

Manual deploy
------------------------------------------------------------

### Configure
``` bash
heroku plugins:install heroku-cli-static 
heroku static:init
```

### Deploy
``` bash
heroku static:deploy
```


TODO
------------------------------------------------------------
- [ ] Implement tests
- [ ] Implement administration (CRUD) for: customers, users, reservoirs, devices, sensors


Credits
------------------------------------------------------------

* Frederico Wuerges Becker <fred.wuerges@gmail.com>
