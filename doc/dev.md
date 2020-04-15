# Development

## Install
Make sure you have OpenPaaS installed from [here](https://ci.linagora.com/linagora/lgs/openpaas/esn)

### Clone module repository

```bash
git clone https://ci.linagora.com/linagora/lgs/smartsla/smartsla-backend
```

### Add the module to OpenPaaS

Add the line `smartsla-backend` to `esn/config/default.json` in modules section

### Install dependencies

In the `smartsla-backend` folder:

```bash
npm install
bower install
```

### Create module npm link in `esn`:

In the `smartsla-backend` folder:

```bash
npm link
```

In the `esn` folder:

```bash
npm link smartsla-backend
```

### Launch OpenPaaS

In the `esn` folder:

```bash
grunt dev
```

## Test

### Local

Make sure you have [docker](https://docs.docker.com/engine/installation/) installed

#### Setup
This step is required for `test-unit-storage` and `test-midway-backend`.

##### Create docker services for test
```bash
docker run --name tic-redis-for-test -d -p 172.17.0.1:6379:6379 redis
docker run --name tic-mongo-for-test -d -p 172.17.0.1:27017:27017 mongo:3.2.0
docker run --name tic-rabbit-for-test -d -p 172.17.0.1:5672:5672 rabbitmq:3.6.5-management
docker run --name tic-es-for-test -d -p 172.17.0.1:9200:9200 elasticsearch:2.3.2
```

##### Edit file `/etc/hosts`:
Add this line: `172.17.0.1 redis rabbitmq elasticsearch mongo`

Don't forget stop those services when test done.

```bash
docker stop tic-redis-for-test tic-mongo-for-test tic-rabbit-for-test tic-es-for-test
```

Then you can start them for next test without create services.
```bash
docker start tic-redis-for-test tic-mongo-for-test tic-rabbit-for-test tic-es-for-test
```

#### Test

- Test unit frontend:
```bash
grunt test-unit-frontend
```
- Test unit backend:
```bash
grunt test-unit-backend
```
- Test unit storage:
```bash
grunt test-unit-storage
```
- Test midway-backend:
```bash
grunt test-midway-backend
```
- Test linters:
```bash
grunt linters
```
- Test all:
```bash
grunt test --chunk=1
```
