
import E from 'wangeditor' // npm 安装
import { MenuActive } from 'wangeditor/dist/menus/menu-constructors/Menu'

const { BtnMenu } = E
export default class HtmlMenu extends BtnMenu implements MenuActive {
    isHTML:boolean
    constructor(editor) {
        const $elem = E.$(
            `<div class="w-e-menu" data-title="源码">
               <i>Html</i>
            </div>`
        )
        super($elem, editor)
        this.isHTML=true;
    }
    // 菜单点击事件
    clickHandler() {
        this.showSource()
        this.tryChangeActive()
    }
    tryChangeActive() {
         this.isHTML ? this.unActive(): this.active() 
    }
    showSource() {
        let _editor = this.editor
        let _source = _editor.txt.html()
        if (this.isHTML) {
            _source = _source.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;")
        } else {
            _source = _editor.txt.text().replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, " ")
        }
        this.isHTML = !this.isHTML
        _editor.txt.html(_source)
    }
}