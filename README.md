## b2b-proprietary

## getting started

```sh
git clone http://172.19.26.140/b2b/b2b-proprietary.git
cd b2b-proprietary
yarn
yarn start
#visit http://localhost:3000
```

## 代码规范

@Action('name')
name 命名大家统一下 模块名：功能名 多个命名可以用‘：’分开 👍  
name 不建议命名方式 userName,user_name，user-name👎  
name 命名一律小写 👍  
name 推荐优先名词命名，动词在后 如 goods:edit👍

## 项目规范

## Storybook

```sh
npm i -g getstorybook
cd my-react-app
getstorybook
yarn run storybook
```

## 注意点
1、启动与打包，以yarn为例，也可以使用npm run
   两种启动方式：1）yarn start, 根据指令选择环境参数
               2）yarn start, 后面直接跟环境参数，
                  例如：yarn start test3,表示连接test3环境启动项目。
   两种打包方式：1）yarn build,  根据指令选择环境参数
               2）yarn build,  后面直接跟环境参数，
                  例如：yarn build test3,表示连接test3环境打包项目。
   请注意我们的线上打包命令为 yarn build:prodAuth 或者 yarn build prodAuth,限制了非system账号的操作权限。
2、当组件里面重新定义了props属性时，请不要在contructor(props)里面使用this.props,
   请使用props.
3、页面引入外部样式文件时，当你的样式文件class有嵌套时，请不要使用css后缀，而使用less后缀。
   import './style/index.less'

