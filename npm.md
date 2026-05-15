# Nginx Proxy Manager Notes

## Custom Location

Create a new custom location with these values:

- Location: `~*`
- Path: `\.(?:js|css|mjs|webp|avif|png|jpg|jpeg|gif|svg|ico|woff2?)$`
- Scheme/Hostname/Port: `same as Origin`

Use the following extra options:

```nginx
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_buffering on;
expires 1y;
add_header Cache-Control "public, max-age=31536000, immutable" always;
add_header Vary "Accept-Encoding" always;
```

## General Configuration

Use the following general proxy configuration:

```nginx
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

proxy_buffering on;
proxy_buffer_size 16k;
proxy_buffers 32 16k;
proxy_busy_buffers_size 64k;

gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_types
  application/javascript
  application/json
  application/manifest+json
  application/rss+xml
  application/vnd.ms-fontobject
  application/wasm
  application/xml
  font/otf
  font/ttf
  image/svg+xml
  text/css
  text/javascript
  text/plain
  text/xml;

brotli on;
brotli_comp_level 5;
brotli_min_length 1024;
brotli_types
  application/javascript
  application/json
  application/manifest+json
  application/wasm
  application/xml
  image/svg+xml
  text/css
  text/javascript
  text/plain
  text/xml;

add_header Cache-Control "no-cache, must-revalidate" always;
add_header Vary "Accept-Encoding" always;
```
