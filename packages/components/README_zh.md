# UI 组件库

## classname 前缀

- js 文件修改`src/utils.ts`中`UI_PREFIX_CLASS`的值
- postcss 修改`postcss.config.js`中`postcss-prefixer.prefix`的值，保持和 js 中一致

### 组件使用流程

##### 封装第三方组件库[naivi-ui](https://www.naiveui.com/zh-CN/light) 主要用意有如下几点：

1. 当自己的软件版本升级时，可能会出现需要更换第三方库的情况，一个库的使用不能满足新的需求，这时，如果使用了二次封装，
   那么库的更改和自己编写的应用层就可以脱离，只需要改写二次封装就可以实现。避免了走入应用层，改写大量的代码甚至软件流程和架构。

2. 当第三方库发生官方升级和出现了官方对已知局限性及 BUG 的修订时，只需要在二次封装的接口层改动即可。

3. 当需求必须对第三方库添加额外功能时，可以添加在二次封装层，避免了对第三方库本身的修改，减少了潜在危险。

4. 新开发人员只需要对二次封装学习就能快速上手，因为二次封装是之前开发人员留下的成果，内部有丰富的资料和统一的编码风格，
   相对于第三方库本身学习要容易和快捷。

相关文档：
[主题色设置](naiveui.com/zh-CN/light/docs/customize-theme)
[国际化设置](naiveui.com/zh-CN/light/docs/i18n)
[样式设置](naiveui.com/zh-CN/light/docs/theme)
