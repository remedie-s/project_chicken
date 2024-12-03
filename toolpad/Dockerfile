# Node 18 이미지를 기반으로
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (production만 설치)
RUN npm install --production

# 애플리케이션 소스 파일 복사
COPY . .

# Next.js 앱 빌드
RUN npm run build

# Next.js 프로덕션 서버 실행
CMD ["npm", "run", "start"]
