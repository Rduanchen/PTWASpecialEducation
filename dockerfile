# 使用 ubuntu-latest 作為基礎映像
FROM ubuntu:latest

# 安裝基本工具和 Node.js 18
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY . .

# 安裝項目依賴
RUN npm install

# 預設執行打包指令
CMD ["npm", "run", "build"]
