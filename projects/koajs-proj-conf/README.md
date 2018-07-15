# Review Request

## 개요
Node.js 초보가 코드를 리뷰 받기 위해 올린 프로젝트

## 실행 방법
### 개발용 서버 실행
```
docker-compose up -d # app 컨테이너와 db 컨테이너를 올립니다.

docker-compose exec app bash # app 컨테이너로 들어간다

npm start # app 컨테이너내에서 Node.js 앱을 실행시킨다.
```

### 테스트
```
docker-compose exec app npm test # 컨테이너 외부
# 또는
npm test # app 컨테이너 내부
```

### 린트 코드
```
docker-compose exec app npm run lint # 컨테이너 외부
# 또는
npm run lint # app 컨테이너 내부
```

## 리뷰 요청
Node.js 초보입니다. Koa.js를 이용해서 웹 애플리케이션을 만들고 있는데 다음과 같은 부분이 궁급해서 리뷰 요청드립니다:
##### Node.js 프로젝트 구조
- 현재 프로젝트 구조는 아래와 같습니다:
```
.
├── Dockerfile
├── README.md
├── app.js
├── docker-compose.yml
├── init
│   └── db-init.sh
├── node_modules
│   └── ...
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── db
    │   ├── client.js
    │   └── index.js
    ├── config.js
    ├── controllers.js
    ├── middlewares.js
    ├── routes.js
    ├── serializers.js
    ├── validators.js
    └── tests
        ├── apit.test.js
        ├── controllers.test.js
        ├── database.test.js
        └── middlewares.test.js
```
- 전체적인 프로젝트 구조가 맞는지 알고 싶습니다. (너무 범위가 넗다면 config 쪽과 db client 를 만들어 사용하는 부분, 미들웨어를 만드는 부분에 대해서만이라고 알려주시면 감사드리겠습니다.)
- ./app.js 에서 database client를 ctx에 세팅해서 컨트롤러에서 사용하고 있습니다.(./app.js#L18) 이런 방법이 올바른 사용 방법인지 알고 싶습니다.

##### 테스트 방법
- 현재는 호출되는 다른 함수들을 모킹해서 테스트하고 (./src/tests/controllers.test.js#L40) DB에 실제 값을 써봐야 할 경우 테스트용 컬렉션을 생성해서(./src/config.js#L13) 테스트하고 테스트후에 지우고 있습니다.
같은 DB 내에서 개발용/테스트용 컬렉션을 나누어 쓰게되는데 문제가 없는지 궁금합니다.

- Node.js 에서 사용하는 테스팅 패턴이 있다면 알려주시면 감사드리겠습니다.

#### Node.js 앱 프로덕션으로 실행 방법
Dockerfile에서 `node ./server.js` 으로 노드 앱을 실행하고 있습니다. (./Dockerfile#L24) 컨테이너 기반환경에서 Node.js 서버를 동작시키는 방법을 추천해주시면 감사드리겠습니다.

#### 기타
- Sanitizing, Validation, Serialze 를 직접 구현해서 사용했는데, 다른 추천하는 방법이나 라이브러리 등이 있으면 알려주시면 감사드리겠습니다.
- 기타 코드에 문제가 있는 부분이 있다면 알려주세요.
