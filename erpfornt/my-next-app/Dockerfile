# Dockerfile
FROM node:18

WORKDIR /app

# package.json과 package-lock.json을 복사하여 의존성 설치
COPY package*.json ./

RUN npm install

# 인증서 파일을 컨테이너로 복사
COPY ./certificates /app/certificates

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 서버 실행
CMD ["node", "server.js"]
