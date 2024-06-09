/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[fibona-ai] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[fibona-ai] Navigate from page "${data.title}"`)
  })

  // 自动化脚本中的鼠标点击事件
  function onclick(e: MouseEvent) {
    const clickX = e.clientX
    const clickY = e.clientY

    let delay = new Date().getTime()
    if (delay > 5)
      delay = 0

    browser.runtime.sendMessage({
      cmd: 'Event-Script',
      type: 'click-event',
      event: {
        x: clickX,
        y: clickY,
        tagName: e.target instanceof HTMLElement ? e.target.tagName : '',
        tagDetail: e.target instanceof HTMLElement ? e.target.innerHTML : '',
        time: delay,
      },
    })
  }
  document.addEventListener('click', onclick, true)

  // 点击事件结束

  // 键盘输入事件开始
  // function onkeyup(ev: KeyboardEvent) {
  //   const flag = ev.target.isNeedPrevent
  //   if (flag)
  //     return
  //   sendInputMessage(ev)

  // }
  // function onkeydown(ev: KeyboardEvent) {
  //   ev.target?.keyEvent = true
  // }
  // function input(ev: KeyboardEvent) {
  //   if (!ev.target.keyEvent)
  //     sendInputMessage(ev)
  // }
  // function compositionstart(ev: KeyboardEvent) {
  //   ev.target.isNeedPrevent = true
  // }
  // function compositionend(ev: KeyboardEvent) {
  //   ev.target.isNeedPrevent = false
  // }

  // // 发送键盘输入事件
  // function sendInputMessage(ev: KeyboardEvent) {
  //   const delay = new Date().getTime()
  //   if (delay > 5) {
  //     browser.runtime.sendMessage({
  //       type: 'key-event',
  //       event: {
  //         type: 'set-input-value',
  //         value: ev.target instanceof HTMLInputElement ? ev.target.value : '',
  //         time: delay,
  //       },
  //     })
  //   }
  // }

  // document.addEventListener('keyup', onkeyup, true)
  // document.addEventListener('keydown', onkeydown, true)
  // document.addEventListener('input', input, true)
  // document.addEventListener('compositionstart', compositionstart, true)
  // document.addEventListener('compositionend', compositionend, true)

  // 键盘输入事件结束

  // mount component to context window
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
