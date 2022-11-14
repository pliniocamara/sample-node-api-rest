const http = require('http');
const url = require('url');

const routes = require('./routes');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`);

    let { pathname } = parsedUrl;
    let id = null;

    const splitEndpoint = pathname.split('/').filter(Boolean);
    
    if (splitEndpoint.length > 1) {
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1];
    }

    const route = routes.find((routeObj) => (
        routeObj.endpoint === pathname && routeObj.method === req.method
    ));

    if (route) {
        req.query = parsedUrl.query;
        req.params = { id };

        res.send = (statusCode, body) => {
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(body)); 
        };

        route.handler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`Cannot ${req.method} ${pathname}`);
    }
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));