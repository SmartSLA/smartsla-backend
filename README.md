# ticketing08000linux.backend
>This is OpenPaaS Module for ticketing feature

## Installation

Make sure you have OpenPaaS installed from [here](https://ci.linagora.com/linagora/lgs/openpaas/openpaas-doc/blob/master/_docs/getting-started/linux.md)

### Add the module to OpenPaaS

#### Production

Add `ticketing08000linux.backend` to `$ESN_PATH/config/default.json` in modules section

Add `"ticketing08000linux.backend": "linagora/ticketing08000linux.backend"` to `$ESN_PATH/packages.json` in dependencies section

install the dependencies

#### Development

link your local ticketing08000linux.backend module to esn using:

08000TICKETING_PATH: refers to the path of your repository

```
cd $ESN_PATH/modules;
ln -s 08000TICKETING_PATH ticketing08000linux.backend
```

add `ticketing08000linux.backend` to the modules list in `$ESN_PATH/config/default.json`

### Install the node packages for the ticketing module

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
    "name": "ticketing08000linux.backend",
    "configurations": [
      {
        "name": "frontendUrl",
        "value": "http://ticketingServeur:port"
      }
    ]
  }
]'
```

Set the _from_ and default responsible addresses for email

Use Curl to set configuration:
```
curl -X POST -H 'Accept: application/json' -H 'Content-Type: application/json'  http://0.0.0.0:8080/api/configurations?scope=platform -u "ADMIN_USERNAME:PASSWORD"  -d '[
  {
    "name": "ticketing08000linux.backend",
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


> **PS**  You need to use ``` \n ``` to attach the lines.

### F.A.Q

> cannot find users when using autocomplete.

you need to configure the LDAP connection in your openpaas instance, details [here](https://ci.linagora.com/linagora/lps/studio/ticketing08000linux/-/wikis/LDAP-Config)