const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k,v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

const session = {};

http.createServer(async (req,res) => {
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const uniqueInt = Date.now()
        session[uniqueInt] = {
            name,
            expires,
        };
        //쿠키에 정보를 직접 넣지 않고 구분할 수 있는 key값을 보냄
        //세션 쿠키: 세션을 위해 사용하는 쿠키
        //실제 서비스에서는 세션을 redis같은 데이터베이스에 넣음
        res.writeHead(302, {
            Location: '/',
            'Set-Cookie':  `session=${uniqueInt}; Expires=${expries.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    } else if(cookies.session && session[cookies.session].expires > new Date()) {
        //세션 쿠키가 존재하고 만료기간이 지나지 않았다면
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요`);
    } else {
        try{
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        } catch(err) {
            res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(err.message);
        }
    }
})
.listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중');
});