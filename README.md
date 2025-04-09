# X账号分析工具

这是一个用于分析X（原Twitter）账号数据的工具，可以统计账号的注册时间、发帖数量、互动数据等信息。

## 功能特点

- 分析账号注册时间
- 统计近一个月发帖数量
- 计算平均浏览量
- 计算平均点赞数
- 计算平均评论数
- 计算平均转发数
- 计算互动率
- 计算曝光互动率

## 技术栈

- 前端：React + TypeScript + Material-UI
- 后端：Cloudflare Workers
- 部署：Cloudflare Pages

## 本地开发

### 前端开发

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

### 后端开发

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
npm install
```

3. 启动本地开发服务器：
```bash
npx wrangler dev
```

## 部署步骤

1. 构建前端：
```bash
cd frontend
npm run build
```

2. 部署到Cloudflare：
```bash
cd backend
npx wrangler deploy
```

3. 在Cloudflare Pages中配置：
   - 选择Git仓库
   - 构建命令：`cd frontend && npm install && npm run build`
   - 输出目录：`frontend/build`
   - 环境变量：无

## 使用说明

1. 打开部署后的网站
2. 在输入框中输入X账号（不需要@符号）
3. 点击"开始分析"按钮
4. 等待分析结果
5. 查看统计数据

## 注意事项

- 由于X的反爬虫机制，可能需要定期更新爬虫逻辑
- 建议不要频繁请求同一个账号的数据
- 数据仅供参考，可能与实际数据有偏差

## 许可证

MIT 