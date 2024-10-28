# Указываем базовый образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в контейнер
COPY . .

# Устанавливаем зависимости для директории `client`
RUN npm install --prefix client

# Собираем клиентское приложение React
RUN npm run build --prefix client

# Указываем порт, который будет использовать сервер
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]
