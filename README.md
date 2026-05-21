# CICD Project

React + Node.js 生产环境部署项目

## 项目结构

```
.
├── api4/                  # 后端 API
│   ├── bin/
│   ├── model/             # 数据库模型
│   ├── public/            # 静态资源
│   ├── routes/            # 路由
│   ├── upload/            # 上传文件目录
│   ├── views/             # 模板
│   ├── .env.example       # 环境变量模板
│   ├── ecosystem.config.js # PM2 配置
│   └── package.json
├── react/                 # 前端应用
│   ├── src/
│   │   ├── api/           # API 封装
│   │   └── ...
│   ├── .env.example       # 环境变量模板
│   ├── vite.config.js
│   └── package.json
├── scripts/               # 部署脚本
│   ├── server-init.sh     # 服务器初始化
│   ├── setup-nginx.sh     # Nginx 配置
│   ├── deploy-api.sh      # API 部署
│   └── deploy-react.sh    # 前端部署
└── .github/
    └── workflows/         # GitHub Actions
        ├── deploy-api.yml
        └── deploy-react.yml
```

## GitHub Secrets 配置

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加以下密钥：

| Secret | 说明 | 示例 |
|--------|------|------|
| `SERVER_IP` | 服务器 IP | 123.45.67.89 |
| `SERVER_USER` | SSH 用户名 | ubuntu |
| `SERVER_PASSWORD` | SSH 密码 | your_password |
| `DB_HOST` | 数据库地址 | rm-xxxx.mysql.rds.aliyuncs.com |
| `DB_USER` | 数据库用户名 | root |
| `DB_PASSWORD` | 数据库密码 | your_db_password |
| `DB_NAME` | 数据库名 | db2506a |
| `JWT_SECRET` | JWT 密钥 | random_secret_string |
| `API_PORT` | API 端口 | 3000 |
| `API_BASE_URL` | API 地址 | /api |
| `DOMAIN` | 域名 | example.com |

## 服务器初始化（首次部署前执行一次）

```bash
# 在服务器上执行
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
sudo pm2 startup systemd
sudo ufw allow 'Nginx Full'

# 创建目录
sudo mkdir -p /var/www/api4 /var/www/react
sudo chown -R www-data:www-data /var/www
```

## 部署流程

### 1. 推送代码到 main 分支

```bash
git init
git add .
git commit -m "feat: initial project setup"
git branch -M main
git remote add origin https://github.com/your-org/cicd.git
git push -u origin main
```

### 2. CI/CD 自动化

- **API 部署**: 推送到 `api4/` 目录 → 自动部署后端
- **前端部署**: 推送到 `react/` 目录 → 自动构建并部署

### 3. 手动触发部署

在 GitHub Actions 页面点击 "Run workflow" 可手动触发部署。

## 常用命令

```bash
# 服务器上查看 API 状态
pm2 list
pm2 logs api4

# 重启 API
pm2 restart api4

# 查看 Nginx 状态
sudo systemctl status nginx
sudo nginx -t

# 查看日志
sudo tail -f /var/log/nginx/error.log
```

## 环境变量说明

### API (.env)
```env
DB_HOST=数据库地址
DB_USER=用户名
DB_PASSWORD=密码
DB_NAME=数据库名
JWT_SECRET=密钥
PORT=3000
NODE_ENV=production
```

### React (.env.production)
```env
VITE_API_BASE_URL=/api
```

## 技术栈

- **前端**: React 19, Vite 8, Axios
- **后端**: Express 4, Sequelize, MySQL
- **进程管理**: PM2
- **Web 服务器**: Nginx
- **CI/CD**: GitHub Actions
- **部署环境**: Ubuntu 22.04 LTS