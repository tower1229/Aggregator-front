# Comunion Web Front

This project is for Comunion V5 version, the packages are managed by `lerna`, and we used vue3

## Directory

```
packages
|- components # shared components
|- docs # the document directory, which was based by  vitepress
|- esbuild-plugin-svg-to-vue3 #  this plugin is used to generate svg  component
|- generator #  this utils help generate code
|- hooks #  shared vue hooks
|- i8n-tools # this utils help translate language
|- icons # manage icons
|- utils # shared utils management
|- web # this is the source code for web pages
```

## how to run

1. clone the project

```sh
git clone git@github.com:comunion-io/v5-front.git
```

2. install packages

```sh
pnpm
```

3. run web pages

```sh
pnpm dev

pnpm dev:web
```

4. run other project except web pages (option)

```sh
# documents
pnpm docs
```

5. pack project

```sh
pnpm build
```

## How to contribute

### For team members

1. clone code
2. "git checkout -b feat/xxx" to create a new branch
3. commit "git add -am 'feat: xxx'"
4. git push
5. [create PR](https://github.com/comunion-io/v5-front/pulls) and Inform manager

### For non team members

1. fork repository
2. "git checkout -b fix/xxx" to create a new branch
3. commit "git add -am 'fix: xxx"
4. git push
5. create PR

[For more details link](https://fe.dev.comunion.io/zh/)
