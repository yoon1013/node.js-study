/* 
쿠키와 새션 -> ex. 로그인
* 쿠키: 키-값 쌍, 서버가 쿠키를 보내면 브라우저는 이후 자동으로 쿠키를 동봉해서 요청
*/
const http = require('http');

http.createServer((req,res) => {
    console.log(req.url, req.headers.cookie); //쿠키는 헤더에!
    console.log('cookie: ', req.headers.cookie);
    //Set-Cookie: "다음과 같은 쿠키를 저장해"
    res.writeHead(200, {'Set-Cookie': 'mycookie=test;year=1999'}); //쿠키: 문자열 형식, 쿠키 간 ;로 구분
    res.end('hello cookie');
})
.listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중');
})

//favicon: 웹사이트 탭의 이미지 -> html이 모르면 서버에 요청함