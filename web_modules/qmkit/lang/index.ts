
import { cache } from 'qmkit';
const context = (require as any).context('./files',true, /\.ts$/)
const importAll = context => {
    const map = {}
    for (const key of context.keys()) {
      const keyArr = key.split('/')
      keyArr.shift() // 移除.
      map[keyArr.join('.').replace(/\.ts$/g, '')] =context(key).default|| context(key)
    }
    return map
  }

let key = sessionStorage.getItem('language')||'en-US'
let langFile = importAll(context)
let language: any = langFile[key];
let antLanguage: any = langFile[key + '_antd'];

function RCi18n ({id}) {
    return language[id] || id;
}

export {
  language,
  antLanguage,
  RCi18n
}
