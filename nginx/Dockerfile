FROM nginx:stable-alpine

COPY ./certs /etc/nginx/certs
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
