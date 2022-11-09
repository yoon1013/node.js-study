const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

/*
parseCookies 함수를 통해
"mycookie=yamyam" 문자열의 쿠키를 { mycookie: 'yamyam' } 객체로 바꿔줌 
*/
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    //'/login' api
    if (req.url.startsWith('/login')) {
        //url 분석
        const { query } = url.parse(req.url);
        //querystring 모듈로 쿼리 분석
        console.log(query);
        const { name } = qs.parse(query);
        const expires = new Date();

        expires.setMinutes(expires.getMinutes() + 5); //쿠키 5분 뒤 만료
        //헤더에 한글설정할 수 없음 -> encodeURIComponenet로 인코딩
        res.writeHead(302, {
            Location: '/', //리다이렉트 주소
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`, //줄바꿈x
        });
        //민감한 정보를 쿠키에 넣으면 정보가 노출되어 있음!(Application 탭에서 쿠키에 name이 보임!)
        res.end();
    } else if (cookies.name) {//name이라는 쿠키가 있는 경우
        res.writeHead(200, { 'Contenet-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`);
    } else { //'/'api, 처음 시작할 때 등 쿠키가 없다면 로그인 html 파일 띄우기
        try {
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    }
})
.listen(8084, () => {
    console.log('8084번 포트에서 서버 대기 중');
});
/*
Set-Cookie 설정 옵션
* 쿠키명=쿠키값
* EXPIRES=날짜: 만료 기한
* Max-age=초: 만료(초 단위), Expires보다 우선
* Domain=도메인 명: 쿠키 전송 시 도메인 특정(기본값: 현재 도메인)
* Path=URL: 쿠키가 전송될 url(기본값: /)
* Secure: HTTPS일 때만 쿠키 전송
* HttpOnly: 자바스크립트에서 쿠키 접근할 수 없음
*/