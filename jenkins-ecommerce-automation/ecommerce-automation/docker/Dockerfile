FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV HEADLESS=true
ENV CI=true

CMD ["npx", "playwright", "test", "--reporter=allure-playwright,list"]
