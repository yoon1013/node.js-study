const express = require('express');
const path = require('path'); //파일을 보내고 싶으면 path 모듈 필요
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = requrie('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
/* 서버가 실행될 포트 설정
process.env 객체에 PORT 속성이 있다면 그 값을 사용하고
없다면 기본값으로 3000번 포트 이용
app.set(키, 값)
나중에 데이터에 접근할 때 app.get(키)로 접근*/
app.set('port', process.env.PORT || 3000);

/*
미들웨어
* 요청과 응답의 중간에 위치하여 요청과 응답 조작 -> 기능 추가 또는 나쁜 요청 걸러내기
* app.use(미들웨어) 꼴로 사용
* app.use에 매개변수 req,res,next인 함수를 넣으면 됨
* 미들웨어는 위에서부터 순서대로 실행
* next()를 실행하지 않으면 다음 미들웨어가 실행되지 않기 때문에 꼭 넣어주기
* app.use(미들웨어): 모든 요청에 대하여 실행
* app.use('/abc', 미들웨어): abc로 시작하는 요청에서 미들웨어 실행
* app.post('/abc', 미들웨어): abc로 시작하는 post 요청에 대하여 미들웨어 실행
*/
app.use(morgan('dev')); //요청과 응답에 대한 정보 콘솔에 기록
app.use('/', express.static(path.join(__dirname, 'public')));//static: 정적 파일 제공 라우터
//body-parser: 요청의 본문의 데이터를 해석하여 req.body 객체로 만들어주는 미들웨어(31, 32)
/* body-parser 미들웨어의 일부 기능이 익스프레스에 내장되어서 따로 설치할 필요x
 그러나 raw, text 형식의 데이터를 해석해야 한다면 body-parser 설치해야 함 */
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //false: querystring 모듈을 사용하여 쿼리스트링 해석 / true: qs 모듈 사용하여 쿼리스트링 해석
/*body-parser를 직접 사용한다면
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
*/
//cookie-parser: 요청에 동봉된 쿠키를 해석해 req.cookie 객체로 만듦
//app.use(cookieParser(비밀키))
//로그인 등 구현할 때 사용해야함
app.use(cookieParser(process.env.COOKIE_SECRET));
//express-session: 세션 관리용 미들웨어, 클라이언트에 쿠키를 보냄
app.use(session({
    resave: false, //요청이 올 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지
    saveUninitialized: false, //세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지
    secret: process.env.COOKIE_SECRET, //쿠키 서명
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie', //세션 쿠키 이름
}));

app.use((req,res,next) => {
    console.log('모든 요청에 다 실행');
    next();
});
app.get('/', (req,res,next) => {
    console.log('get / 요청에서만 실행');
    next();
}, (req,res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다');
});

app.use((err,req,res,next) => {//에러처리 미들웨어
    console.error(err);
    res.status(500).send(err.message);
});

/*get요청 처리
req: 요청 객체
res: 응답 객체
express 모듈에서는 res.write, res.end 대신 res.send 사용
app.post, app.put, app.patch, app.delete, app.option 등으로 사용하면 됨
 */
app.get('/', (req,res) => {
    //res.send('Hello Express');
    res.sendFile(path.join(__dirname, '/index.html'));
});

/*app.get(키: 여기서는 port)로 포트 연결 */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})