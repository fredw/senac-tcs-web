Water Reservoir Web
================================================================================
[![Codeship Status for fredw/senac-tcs-web](https://app.codeship.com/projects/ea1fa610-1980-0135-1f15-7e4720114d12/status?branch=master)](https://app.codeship.com/projects/219312)

Web interface for water reservoir control developed for the **Semester Completion Work** for the **Systems Analysis and Development** course at the **SENAC Blumenau**.  
The proposal is to develop a prototype for water control of reservoirs (cisterns, water tanks, etc.) in condominiums.  
This repository contains only the interface layer of the solution, in which it consumes all system logic through a [RESTful API](https://github.com/fredw/senac-tcs-api).

Commands
------------------------------------------------------------

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report

# Run unit tests
npm run unit

# Run e2e tests
npm run e2e

# Run all tests
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


TODO and Improvements
------------------------------------------------------------
- [ ] Implement tests
- [ ] Display some useful data on home page
- [ ] Implement administration (CRUD) for: customers, users, reservoirs, devices, sensors


Credits
------------------------------------------------------------
* Frederico Wuerges Becker <fred.wuerges@gmail.com>
