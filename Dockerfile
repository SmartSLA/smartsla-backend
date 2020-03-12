# Build stage
FROM docker-registry.linagora.com:5000/openpaas-releases/openpaas-esn:1.6.2
COPY backend package.json index.js /var/www/node_modules/linagora.esn.ticketing/
RUN cd /var/www/node_modules/linagora.esn.ticketing && npm install --production
