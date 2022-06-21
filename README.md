# SmartSLA-backend
>This is OpenPaaS Module for SmartSLA

## Installation

Make sure you have OpenPaaS installed from [here](https://github.com/linagora/openpaas-esn)

### Add the module to OpenPaaS

#### Production

Add `smartsla-backend` to `$ESN_PATH/config/default.json` in modules section

Add `"smartsla-backend": "linagora/smartsla-backend"` to `$ESN_PATH/packages.json` in dependencies section

install the dependencies

#### Development

link your local smartsla-backend module to esn using:

SMARTSLA_PATH: refers to the path of your repository

```
cd $ESN_PATH/modules;
ln -s SMARTSLA_PATH smartsla-backend
```

add `smartsla-backend` to the modules list in `$ESN_PATH/config/default.json`

### Install the node packages for the smartsla-backend module

In the `esn` folder do
```
npm install
```

### Launch OpenPaaS

In the `esn` folder
```
npm start
```

### Configuration

Set the frontend Url (needed to add link to request in email)

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "frontendUrl",
        "value": "http://smartslaServer:port"
      }
    ]
  }
]'
```

Set the _from_ and default responsible addresses for email

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name" : "mail",
        "value" : {
          "replyto" : "ossa-dev@linagora.com",
          "noreply" : "noreply-dev@linagora.com",
          "support" : "ossa-dev@linagora.com"
        }
      }
    ]
  }
]'
```

Set SSP config (required to reset a user's password)

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "admin@open-paas.org:secret"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "ssp",
        "value": {
          "sspUrl": "https://ssp.08000linux.com/",
          "sspUrlReset": "https://ssp.08000linux.com/?action=sendtoken",
          "isSspEnabled": true
        }
      }
    ]
  }
]'
```

Configure feature flipping

Feature list :

* LimeSurvey

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "features",
        "value": {
          "isLimesurveyEnabled": false
        }
      }
    ]
  }
]'
```

Set limesurvey config (needed to use limesurvey API)

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "limesurvey",
        "value": {
          "surveyId": 158386,
          "apiUrl": "http://limesurvey.localhost:8080/index.php/admin/remotecontrol/",
          "username": "username",
          "password": "password",
          "limesurveyUrl": "http://limesurvey.localhost:8080/"
        }
      }
    ]
  }
]'
```

* LinInfoSec

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://backend.smartsla.local/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "features",
        "value": {
          "isLinInfoSecEnabled": true
        }
      }
    ]
  }
]'
```

Set lininfosecconfig (needed to use lininfosec API)

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "lininfosec",
        "value": {
          "apiUrl": "http://lininfosec.smartsla.local:8080/",
          "lininfosec_auth_token": "TOKEN"
        }
      }
    ]
  }
]'
```

Use this curl to set the author of the automatic ticket created when the vulnerability notification sent by LinInfoSec.

```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations\?scope\=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[{
    "name": "smartsla-backend",
    "configurations": [{
        "name": "lininfosec",
        "value": {
            "author": {
                "id": "authorId",
                "name": "authorName",
                "email": "authorEmail",
                "type": "authorType",
                "phone": "authorPhone"
            }
        }
    }]
}]'
```

* Dashboard

Use Curl to set configuration:
```
curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "smartsla-backend",
    "configurations": [
      {
        "name": "features",
        "value": {
          "isDashboardEnabled": false
        }
      }
    ]
  }
]'
```

> **PS**  You need to use ``` \n ``` to attach the lines.

### F.A.Q

> cannot find users when using autocomplete.

you need to configure the LDAP connection in your openpaas instance, details [here](https://ci.linagora.com/linagora/lgs/smartsla/smartsla-frontend/wikis/LDAP-Config)

------------

## Tools & developers information

### Testing

You can check that everything works by launching the test suite (this may be long):

    grunt --chunk=1

Note that, due to the large amount of tests, you eventually need the `--chunk=1` option. It will create one new nodejs process per js test file. It prevents the memory to be overused by mocha, which would lead to tests failures.
If you want to launch tests from a single test, you can specify the file as command line argument.
For example, you can launch the backend tests on the test/unit-backend/webserver/index.js file like this:

    grunt test-unit-backend --test=test/unit-backend/webserver/index.js

Note: This works for backend and midway tests.

Some specialized Grunt tasks are available, check the Gruntfile.js for more:

    grunt linters # launch hinter and linter against the codebase
    grunt test-frontend # only run the fontend unit tests
    grunt test-unit-backend # only run the unit backend tests
    grunt test-midway-backend # only run the midway backend tests
    grunt test # launch all the testsuite

### Debug

You can debug the backend thanks to Node debugger. Launch with the `--inspect` flag or `--inspect-brk` if you want to break on the first line of the application

    node --inspect server.js

    Debugger listening on ws://127.0.0.1:9229/fe0b0fa5-6a26-4ac3-ac74-c6f254c2e24c
    For help see https://nodejs.org/en/docs/inspector

This debugger can be reached in two ways as explained [here](https://nodejs.org/en/docs/inspector/#inspector-tools-clients). Once done you will have the message `Debugger attached` in your terminal. Now you can add breakpoints, inspect, have fun and feel the power.

If you need to have access to the source code (not the minified one), then you should do:

    NODE_ENV="dev" node --inspect --inspect-brk server.js

Yon can also debug backend tests using `INSPECT=true` environment variable:

    INSPECT=true grunt test-midway-backend
    ...
    Debugger listening on ws://127.0.0.1:9229/1859ec1c-bbc8-4044-9f5c-d9dd71e7720f
    For help see https://nodejs.org/en/docs/inspector

### How to run the tests

Make sure you have [gitlab-ci-multi-runner](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner) installed locally, following the [installation instructions](https://docs.gitlab.com/runner/install/).  
Make sure you have **Docker** installed.  
  
Run tests:

```
$ gitlab-ci-multi-runner exec docker test
```

This will pull all required images, and run the whole tests suite in a Docker container.  
