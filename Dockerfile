FROM nginx:stable-alpine

ADD dist /usr/share/nginx/html/apps/book-locator-frontend

ADD default.conf /etc/nginx/conf.d/
