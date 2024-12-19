const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// HTTPS 인증서 경로
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'selfsigned.crt')),
};

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3001');
    });
});
