/*HTTP 요청 메서드
* GET: 서버 자원을 가져오고자 할 때, 요청의 본문에 데이터를 넣지 않고 보낼 데이터가 있다면 쿼리스트링 사용
* POST: 서버에 자원을 새로 등록할 때, 요청의 본문에 새로 등록할 데이터를 넣어서 보냄, 애매한 요청은 그냥POST로 보내기
* PUT: 서버에 있는 데이터를 치환할 때, 본문에는 새로 치환할 데이터
* PATCH: 서버 자원의 일부만 수정하고 싶을 때
* DELETE: 서버 자원을 삭제할 때
* OPTIONS: 요청하기 전 통신 옵션 설명 
*/
const http = require('http');
const fs = require('fs').promises;

const users = {}; //데이터 저장용 객체

http.createServer(async (req,res) => {
    try{
        console.log(req.method, req.url);
        //GET요청이면 req.url로 요청 주소 구분
        if(req.method === 'GET') {
            if(req.url === '/') {
                const data = await fs.readFile('./restFont.html');
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data); //명시적으로 함수 종료시킬 것!
            } else if(req.url === '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if(req.url === '/users') {
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                return res.end(JSON.stringify(users));
            }
            try {//주소가 위에서 구분한 주소가 아닌 경우
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            } catch(err) {
                console.error(err);
            }
        } else if(req.method === 'POST') { //사용자 새로 저장
            if(req.url === '/user') {
                let body = '';
                //요청의 body를 stream으로 받음(이벤트 형식)
                req.on('data', (data) => {
                    body += data;
                });
                //body를 다 받고
                return req.on('end', () => {
                    console.log('POST 본문(Body): ', body);
                    //요청은 주소(문자열) -> json으로 만듦
                    const { name } = JSON.parse(body);
                    const id = Date.now()
                    users[id] = name;
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if(req.method === 'PUT') { //사용자 정보 수정
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문: ', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users));
                });
            }
        } else if(req.method === 'DELETE') { //사용자 삭제
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
        //주소에 해당하는 라우터가 없으니까 404에러 발생
        res.writeHead(404);
        return res.end('Not Found');
    } catch(err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(err.message);
    }
})
.listen(8082, () => {
    console.log('8082번 포트에서 서버 대기 중');
});