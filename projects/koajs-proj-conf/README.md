# Review Request

## 개요
Node.js 앱 리뷰용 코드

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
npm test # app 컨테이너 외부
```

## 리뷰 요청
Node.js 초보입니다. Koa.js를 이용해서 웹 애플리케이션을 만들고 있는데 다음과 같은 부분이 궁급해서 리뷰 요청드립니다:
## Node.js 프로젝트 구조

## Node.js 앱 프로덕션으로 실행 방법

## 기타
