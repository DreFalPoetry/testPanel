[English](./README.md) | 简体中文

# Ant Design Pro -- Demo

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

- 预览：http://preview.pro.ant.design
- 首页：http://pro.ant.design/index-cn
- 使用文档：http://pro.ant.design/docs/getting-started-cn
- 更新日志: http://pro.ant.design/docs/changelog-cn
- 常见问题：http://pro.ant.design/docs/faq-cn
- 国内镜像：http://ant-design-pro.gitee.io

## 特性

- :gem: **优雅美观**：基于 Ant Design 体系精心设计
- :triangular_ruler: **常见设计模式**：提炼自中后台应用的典型页面和场景
- :rocket: **最新技术栈**：使用 React/dva/antd 等前端前沿技术开发
- :iphone: **响应式**：针对不同屏幕大小设计
- :art: **主题**：可配置的主题满足多样化的品牌诉求
- :globe_with_meridians: **国际化**：内建业界通用的国际化方案
- :gear: **最佳实践**：良好的工程实践助您持续产出高质量代码
- :1234: **Mock 数据**：实用的本地数据调试方案
- :white_check_mark: **UI 测试**：自动化测试保障前端产品质量

## 使用

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # 访问 http://localhost:8000
```

也可以使用集成化的 [ant-design-pro-cli](https://github.com/ant-design/ant-design-pro-cli) 工具。

```bash
$ npm install ant-design-pro-cli -g
$ mkdir pro-demo && cd pro-demo
$ pro new
```

更多信息请参考 [使用文档](http://pro.ant.design/docs/getting-started)。

## 问题

**1. 关于项目运行过程中的报内存错误问题** 

​    	页面所引用的数据模型在  `src/common` 文件夹中的 `model` 一定要引入，且在页面的编写一些不符合规范的组件也会造成项目无法运行。

**2.`npm start  ` 的时候路由直接跳转到`index` 而不是 `login` 页面的问题**

​	在`utils ` 文件夹中的：

```
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}
```

该方法设置了返回的角色信息，没有拿到 `local`  中的角色信息的时候默认返回角色信息为 `admin` 

## 代码规范问题

**1.代码整体格式规范**

- 项目代码统一使用Tab4格缩进书写格式。
- css命名：因项目的样式引入问题，antpro项目先约定类名也采用驼峰命名发 例：`iconGroup:{font-size:"12px"}`  
- js：文件内的方法写在react生命周期之后，使用驼峰命名法和语义化的英文进行方法的命名，自己写的操作方法最好写上注释信息， 例：`changeReadStatus = () => { //注释 }`  
- 代码调试之后去除多余的 `console`  