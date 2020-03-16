# Build stage
FROM docker-registry.linagora.com:5000/openpaas-releases/openpaas-esn:1.6.2
COPY backend package.json index.js /var/www/node_modules/ticketing08000linux.backend/
COPY config/esn/default.production.json /var/www/config/default.production.json
RUN cd /var/www/node_modules/ticketing08000linux.backend && npm install --production
