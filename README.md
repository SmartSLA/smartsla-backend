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
          "password": "password"
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
