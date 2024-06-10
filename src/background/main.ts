import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

//
// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// 注册菜单栏内容
function registerContextMenu() {
  browser.contextMenus.create({
    id: 'test',
    title: 'Test menu',
    contexts: ['all'],
  })
}

// 当content script加载时，进行初始化配置，并且进行持久化保存等操作
browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
  registerContextMenu()
})

// to toggle the sidepanel with the action button in chromium:
// browser.sidePanel
//  .setPanelBehavior({ openPanelOnActionClick: true })
//  .catch((error) => console.error(error))

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

function getTitle() {
  const title = document.title

  const newDiv = document.createElement('div')
  newDiv.style.position = 'fixed'
  newDiv.style.top = '50%'
  newDiv.style.left = '40%'
  newDiv.style.width = ''
  newDiv.style.height = ''
  newDiv.style.backgroundColor = 'red'
  newDiv.style.color = 'white'
  newDiv.style.zIndex = '10000'
  newDiv.style.textAlign = 'center'
  newDiv.style.paddingTop = '10px'
  newDiv.style.paddingBottom = '10px'
  newDiv.style.fontSize = '20px'
  newDiv.innerHTML = `本页标题是：${title}  显示3秒后消失`
  document.body.appendChild(newDiv)
  setTimeout(() => {
    document.body.removeChild(newDiv)
  }, 3000)
}

// 接收信息
browser.runtime.onMessage.addListener(
  async (request, sender, _sendResponse: (...args: any[]) => void) => {
    // eslint-disable-next-line no-console
    console.log(sender.tab
      ? `from a content script:${sender.tab.url}`
      : 'from the extension')
    // 前面两个case被废弃了
    switch (request.cmd) {
      case 'openSidePanel':
        sender.tab?.id && browser.sidePanel.open({ tabId: sender.tab.id })
        break
      case 'Event-Script':
        // 模拟注入的script
        // eslint-disable-next-line no-console
        console.log('Event-Script', request)
        browser.scripting.executeScript({
          target: { tabId: sender.tab?.id },
          func: getTitle,
        }).then(() => {
          // eslint-disable-next-line no-console
          console.log('Event-Script injected')
        })
        break
      case 'key-event':
        // eslint-disable-next-line no-console
        console.log('key-event', request)
        break
      case 'inject-script':
        // eslint-disable-next-line no-console
        console.log('inject-script', request)
        break
      default:
        break
    }
  },
)
