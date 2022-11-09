const http = require('http');

//한번에 여러 서버 실행하기
http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>port 8080</h1>');
    res.end('<p>Hello Server</p>');
})
.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다');
});

http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>port 8081</h1>');
    res.end('<p>Hello Server</p>');
})
.listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중');
})