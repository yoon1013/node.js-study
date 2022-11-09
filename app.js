const express = require('express');

const app = express();
/* 서버가 실행될 포트 설정
process.env 객체에 PORT 속성이 있다면 그 값을 사용하고
없다면 기본값으로 3000번 포트 이용
app.set(키, 값)
나중에 데이터에 접근할 때 app.get(키)로 접근*/
app.set('port', process.env.PORT || 3000);

/*get요청 처리
req: 요청 객체
res: 응답 객체
express 모듈에서는 res.write, res.end 대신 res.send 사용
app.post, app.put, app.patch, app.delete, app.option 등으로 사용하면 됨
 */
app.get('/', (req,res) => {
    res.send('Hello Express');
});

/*app.get(키: 여기서는 port)로 포트 연결 */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})