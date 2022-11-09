/*
https모듈
* 웹 서버에 SSL 암호화 추가
* 서버-클라이언트 간 오가는 데이터를 암호화해서 중간에 다른 사람이 가로채더라도 내용 확인X
* 도메인 및 인증서 필요
 */
const https = require('https');
const fs = require('fs');

https.createServer({//parameter 2개(인증서 관련 객체, 서버 로직)
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
}, (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node</h1>');
    res.end('<p>Hello server</p>');
})
.listen(443, () => {
    console.log('443번 포트에서 서버 대기 중');
});