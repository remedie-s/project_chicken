# Node 18 이미지를 기반으로
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사
COPY package*.json ./

# 의존성 설치 (캐시를 최대한 활용)
RUN npm install

# 애플리케이션 소스 파일 복사
COPY . .

# 빌드 환경 설정
ENV NODE_ENV=production

# Next.js 앱 빌드
RUN npm run build

# 빌드 후 프로덕션 서버 실행
CMD ["npm", "run", "start"]
