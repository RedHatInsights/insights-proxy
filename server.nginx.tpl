server {
    listen 1337 ssl;
    server_name DOWNSTREAM;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # content location /insightsbeta/static { proxy_pass UPSTREAM/insightsbeta/static; }
    # content location /insights/static { proxy_pass UPSTREAM/insights/static; }

    location /insightsbeta { proxy_pass http://localhost:9000/insightsbeta; }
    location /insights { proxy_pass http://localhost:9000/insights; }
    location /browser-sync { proxy_pass http://localhost:9000/browser-sync; }

    location / {
        resolver 10.11.5.19;
        proxy_pass UPSTREAM;
        sub_filter "UPSTREAM" "https://DOWNSTREAM:1337";
        sub_filter_once off;
    }
}
