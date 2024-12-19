const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// 인증서 파일 경로 변경
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'selfsigned.crt')),
};

// 프로덕션 모드로 Next.js 실행
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3001, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3001');
    });
});
