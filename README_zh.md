# Comunion 前端项目

这是 Comunion 的前端代码，项目使用 `pnpm` 进行多包管理，主要是用 `Vue3` 和相关技术栈进行开发。

## 代码结构

```
packages
|- components # 通用组件管理
|- docs # 文档目录，基于 vitepress
|- hooks # 通用 vue hooks
|- icons # 图标管理
|- utils # 通用工具库管理
|- homeage # 对外宣传页
|- web # 前端页面
```

## 如何运行项目

1. 拉取代码

```sh
git clone git@github.com:comunion-io/v5-front.git
```

2. 安装依赖

```sh
pnpm i
```

3. 运行 web 项目

```sh
pnpm dev
## 如果其它包不改，只关心web包，可以运行
pnpm dev:web
```

4. 运行其它项目（可选）

```sh
# 文档
pnpm docs
```

5. 打包

```sh
pnpm build:prod
```

## 如何贡献代码

### 对于团队开发成员

1. clone 代码
2. git checkout -b feat/xxx 根据代码修改内容切换一个新分支
3. 修改代码并提交 git add -am 'feat: xxx'
4. git push 推送代码
5. [创建新的 PR](https://github.com/comunion-io/v5-front/pulls)并通知代码管理员

### 对于非开发成员

1. fork 仓库
2. git checkout -b fix/xxx 根据代码修改内容切换一个新分支
3. 修改代码并提交 git add -am 'fix: xxx'
4. git push 推送代码
5. 从你的代码库提交一个 PR

[更多细节请参照](https://fe.dev.comunion.io/zh/)
