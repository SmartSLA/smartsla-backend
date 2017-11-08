# linagora.esn.ticketing

> OpenPaaS Module for ticketing feature

## I. Prepare

## II. Install

### Clone the [Git repo](https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.ticketing) 

Clone the repo of the ticketing module in the `esn/modules` folder of OpenPaaS

```
git clone https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.ticketing
```

### Add the module to OpenPaaS

Add the line `linagora.esn.ticketing` to `esn/config/default.json` in modules section

### Install the node packages of the ticketing module

In the linagora.esn.ticketing folder do
```
npm install
```

Optional :
```
npm update
bower install
```

### Make admin@open-paas.org as the platformadmin of OpenPaaS

In the ```esn``` folder do
```
node ./bin/cli platformadmin init --email admin@open-paas.org
```

### Make admin@open-paas.org as the admin

#### admin@open-paas.org ID
Firstly search for the ID of admin@open-paas.org. Access the MongoDB database with some GUI software (like [Robo3T](https://robomongo.org/)).
Then look at the `users` collection. The first entry should contain `admin@open-paas.org`, copy its   `_id` field.

#### TicketingUserRoles collection
Create a collection named ```ticketinguserroles```
Add this document into TicketingUserRoles collection :

```
{
    "user": ObjectId("[admin@open-paas.org ID]"),
    "role" : "administrator"
}
```

Make sure to replace [admin@open-paas.org] with the ID you found earlier.

### Launch OpenPaaS 

In the esn folder
```
grunt dev
```

### Accessing the ticketing module

The ticketing module can be accessed at the adress : [Ticketing module](http://localhost:8080/#/ticketing) (/#/ticketing)
The ticketing module admin platform can be accessed at the adress : [Admin platform](http://localhost:8080/#/ticketing/admin) (/#/ticketing/admin)

## F.A.Q.

> User autocompletion in the ticketing module is not working.

You should reindex your datas in elasticsearch
(Make sure to have changed admin@open-paas.org as the platformadmin and that the docker services (mongodb) have been launched.)

Go to http://localhost:8080/#/admin
On the dropdown menu next to `Administration` click on `Switch to domain mode`
Go to the `Maintenance` section and click on reindex