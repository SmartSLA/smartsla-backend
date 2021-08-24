# Build stage
FROM docker-registry.linagora.com:5000/openpaas-releases/openpaas-esn:1.6.4
COPY package.json index.js /var/www/node_modules/smartsla-backend/
COPY backend/ /var/www/node_modules/smartsla-backend/backend/
COPY config/esn/default.production.json /var/www/config/default.production.json
RUN cd /var/www/node_modules/smartsla-backend && npm install --production
