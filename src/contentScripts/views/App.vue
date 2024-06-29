<script setup lang="ts">
import 'uno.css'
import { chain } from '../../langchain/index'

// 全局选中内容变量
const SELECTED_TEXT = ref('')
const IS_FIRST_CHOSEN = ref(true)

const popupContainer = ref()
const title = ref()
const x = ref('0')
const y = ref('0')
const open = ref('none')
const content = ref('你好，欢迎使用Fibona AI助手！')
const isSidebarOpen = ref(false)

// 打开侧边栏
async function handleSidebar() {
  browser.runtime.sendMessage({ cmd: 'openSidePanel' }).then(() => {
    // eslint-disable-next-line no-console
    console.log('open sidepanel')
  })
}

// 关闭弹窗
function handleStop() {
  IS_FIRST_CHOSEN.value = true
  open.value = 'none'
  SELECTED_TEXT.value = ''
  content.value = '你好，欢迎使用Fibona AI助手！'
}

// 翻译
function handleTranslate() {
  content.value = `正在翻译【${SELECTED_TEXT.value}】...`

  // console.log('translate', SELECTED_TEXT.value)
  chain.invoke({
    text: `translate '${SELECTED_TEXT.value}' into en`,
  }).then((result: string[]) => {
    // eslint-disable-next-line no-console
    console.log('result', result)
    content.value = result.join(', ')
  })
}

// 摘要
function handleSummary() {
  content.value = `正在总结【${SELECTED_TEXT.value}】...`
  // console.log('summary', SELECTED_TEXT.value)
  chain.invoke({
    text: `summary '${SELECTED_TEXT.value}' in at most 5 sentences in zh-cn`,
  }).then((result: string[]) => {
    // eslint-disable-next-line no-console
    console.log('result', result)
    content.value = result.join(', ')
  })
}

// const sidebarText = ref('open sidebar')

const popupStyle = computed(() => {
  let style = `display: ${open.value}; top: ${y.value}; left: ${x.value};`
  if (isSidebarOpen.value)
    style = 'top: 0; right: 0; width: 20%; height: 100vh; padding: 0px; background-color: #f4f4f4; z-index: 1;'
  return style
})

// 拖拽
function startDrag(event: any): void | boolean {
  // console.log(x.value, y.value)
  // 避免点击到拖拽图标以外的元素
  for (const child of title.value.children) {
    if (child.contains(event.target) && child.classList.contains('btns'))
      return true
  }
  // 禁止默认事件
  event.preventDefault()
  // 在按下鼠标的时候，记录鼠标的位置和弹窗的位置
  const startX = event.clientX
  const startY = event.clientY
  const startLeft = popupContainer.value.offsetLeft
  const startTop = popupContainer.value.offsetTop
  popupContainer.value.style.cursor = 'grabbing'
  // 当拖拽发生时执行的函数
  const drag = (event: any): void | boolean => {
    const moveddx = event.clientX - startX
    const moveddy = event.clientY - startY
    const newLeft = startLeft + moveddx
    const newTop = startTop + moveddy
    x.value = `${newLeft}px`
    y.value = `${newTop}px`
  }
  const stopDrag = () => {
    // console.log('stop drag')
    popupContainer.value.style.cursor = 'grab'
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDrag)
  }
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

function openFibona(event: MouseEvent) {
  if (IS_FIRST_CHOSEN.value) {
    IS_FIRST_CHOSEN.value = false
    open.value = 'block'
    x.value = `${event.clientX}px`
    y.value = `${event.clientY}px`
  }
  const fibona = document.getElementById('popup_container')
  if (fibona && !fibona.contains(event.target as Node)) {
    open.value = 'block'
    x.value = `${event.clientX}px`
    y.value = `${event.clientY}px`
  }
}

onMounted(() => {
  const root = document.getElementsByTagName('html')[0]
  root && root.addEventListener('mouseup', (event: MouseEvent) => {
    const selection = window.getSelection()
    // 打开Fibona助手
    if (selection && selection.toString() !== '') {
      openFibona(event)
      SELECTED_TEXT.value = selection.toString()
      // eslint-disable-next-line no-console
      console.log('选中的内容：', SELECTED_TEXT.value)
    }
  })
})
</script>

<template>
  <div
    id="popup_container"
    ref="popupContainer"
    class="fixed right-0 bottom-0 z-100 flex items-end font-sans select-none leading-1em"
    :style="popupStyle"
  >
    <div
      class="bg-white text-gray-800 rounded-lg shadow w-max h-min"
      transition="opacity duration-300"
      @mousedown="startDrag"
    >
      <main class="max_container">
        <div ref="popupContainer" class="fibonaHelper__popup">
          <div ref="title" class="fibonaHelper__title__container">
            <img class="fibonaHelper__img" draggable="false" src="https://fibona-sdk-1253358381.cos.ap-guangzhou.myqcloud.com/icon_imgs/fibona-logo.png" alt="">
            <div class="fibonaHelper__title">
              Fibona AI
            </div>
            <div class="btns" style="display: flex;margin-left: auto;flex-direction: row;gap: 10px; margin-right: 10px;">
              <div class="iconbutton" @click="handleSummary">
                <svg style="width: 1.5em;height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="918"><path d="M370.85184 760.95488l-106.33216 10.07616a22.44608 22.44608 0 0 1-24.49408-24.45312l10.07616-106.33216c1.2288-12.98432 6.9632-25.14944 16.22016-34.4064l393.66656-393.66656a56.1152 56.1152 0 0 1 79.38048 0l59.55584 59.55584a56.1152 56.1152 0 0 1 0 79.38048l-393.70752 393.70752a56.15616 56.15616 0 0 1-34.4064 16.13824z" fill="#000000" p-id="919" /><path d="M262.3488 797.0816a48.3328 48.3328 0 0 1-48.08704-52.92032l10.07616-106.33216c1.80224-19.00544 10.15808-36.78208 23.63392-50.29888l393.70752-393.6256a82.1248 82.1248 0 0 1 115.99872 0l59.55584 59.55584a81.96096 81.96096 0 0 1 0 115.99872l-393.70752 393.6256c-13.5168 13.5168-31.25248 21.83168-50.25792 23.67488l-106.2912 10.07616a51.73248 51.73248 0 0 1-4.62848 0.2048zM699.67872 221.5936a30.14656 30.14656 0 0 0-21.38112 8.84736l-393.70752 393.70752a30.3104 30.3104 0 0 0-8.68352 18.55488l-9.70752 102.1952 102.1952-9.66656a30.3104 30.3104 0 0 0 18.51392-8.76544l393.70752-393.70752a30.22848 30.22848 0 0 0 0-42.76224l-59.55584-59.55584a30.06464 30.06464 0 0 0-21.38112-8.8064zM213.4016 841.56416h651.0592c18.71872 0 28.0576 9.37984 28.0576 28.0576 0 18.71872-9.33888 28.09856-28.0576 28.09856H213.36064c-18.67776 0-28.0576-9.37984-28.0576-28.0576 0-18.71872 9.37984-28.09856 28.0576-28.09856z" fill="#000000" p-id="920" /></svg>
              </div>
              <div class="iconbutton" @click="handleTranslate">
                <svg t="1716914919760" style="width: 1.5em;height: 1.5em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1069"><path d="M239.0016 732.3648a39.03488 39.03488 0 0 0 39.15776-38.95296 39.03488 39.03488 0 0 0-39.15776-38.912 37.76512 37.76512 0 0 1-37.84704-37.6832V279.3472c0-20.76672 16.95744-37.64224 37.84704-37.64224h339.27168c20.8896 0 37.84704 16.87552 37.84704 37.6832 0 21.46304 17.53088 38.912 39.15776 38.912a39.03488 39.03488 0 0 0 39.1168-38.912A116.08064 116.08064 0 0 0 578.27328 163.84H239.0016A116.08064 116.08064 0 0 0 122.88 279.3472v337.46944a116.08064 116.08064 0 0 0 116.1216 115.5072zM412.59008 901.12h324.89472A122.18368 122.18368 0 0 0 860.16 779.42784v-324.8128a122.18368 122.18368 0 0 0-122.30656-122.0608H412.59008a122.18368 122.18368 0 0 0-122.6752 122.0608v324.4032C288.60416 846.6432 344.71936 901.12 412.59008 901.12z m324.89472-490.7008a43.90912 43.90912 0 0 1 44.40064 43.4176V779.0592a43.90912 43.90912 0 0 1-43.66336 44.15488h-325.632a43.90912 43.90912 0 0 1-44.40064-43.4176V454.57408a43.90912 43.90912 0 0 1 43.66336-44.15488h325.632z" fill="#000000" p-id="1070" /></svg>
              </div>
              <div class="iconbutton" @click="handleSidebar">
                <svg style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3397">
                  <path d="M395.731085 571.196755l10.18176 10.18176q4.072704 4.072704 8.145408 7.63632t8.145408 7.63632l12.218112 12.218112q20.363521 20.363521 16.290817 35.636161t-25.454401 35.636161q-9.163584 10.18176-30.036193 31.054369t-44.799745 45.308833-46.32701 46.836098-34.617985 35.636161q-18.327169 18.327169-25.454401 32.072545t6.109056 26.981665q9.163584 9.163584 23.418049 24.436225t24.436225 25.454401q17.308993 17.308993 12.7272 30.545281t-30.036193 15.27264q-26.472577 3.054528-59.05421 7.127232t-67.199618 7.63632-67.708706 7.63632-60.581474 7.127232q-26.472577 3.054528-36.654337-6.618144t-8.145408-34.108897q2.036352-25.454401 5.599968-57.017858t7.63632-64.654178 7.63632-65.672354 6.618144-60.072386q3.054528-29.527105 16.799905-37.672513t31.054369 9.163584q10.18176 10.18176 26.472577 24.945313t27.490753 25.963489 21.381697 7.127232 23.418049-16.290817q13.236288-13.236288 36.145249-36.654337t47.854274-48.363362 48.363362-48.87245 37.672513-38.181601q6.109056-6.109056 13.745376-11.709024t16.799905-7.63632 18.836257 1.018176 20.872609 13.236288zM910.928158 58.036034q26.472577-3.054528 36.654337 6.618144t8.145408 34.108897q-2.036352 25.454401-5.599968 57.017858t-7.63632 64.654178-7.63632 66.181442-6.618144 60.581474q-3.054528 29.527105-16.799905 37.163425t-31.054369-9.672672q-10.18176-10.18176-27.999841-26.472577t-29.018017-27.490753-19.345345-9.672672-20.363521 13.745376q-14.254464 14.254464-37.163425 37.672513t-48.363362 49.381538-49.890626 50.399714l-37.672513 37.672513q-6.109056 6.109056-13.236288 12.218112t-15.781729 9.163584-18.327169 1.018176-19.854433-13.236288l-38.690689-38.690689q-20.363521-20.363521-17.818081-37.163425t22.908961-37.163425q9.163584-9.163584 30.545281-31.054369t45.817921-46.32701 47.345186-47.854274 36.145249-35.636161q18.327169-18.327169 22.908961-30.036193t-8.654496-24.945313q-9.163584-9.163584-21.890785-22.399873t-22.908961-23.418049q-17.308993-17.308993-12.7272-30.545281t30.036193-16.290817 58.545122-7.127232 67.708706-7.63632 67.708706-7.63632 60.581474-7.127232z" p-id="3398" />
                </svg>
              </div>
              <div class="iconbutton" @click="handleStop">
                <svg style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10442">
                  <path d="M622.8992 512l256.192-256.192c19.2576-19.264 22.5472-47.2128 7.3472-62.4064l-55.8592-55.8592c-15.2-15.2-43.1104-11.8656-62.4064 7.3856L512.0064 401.1136 255.8208 144.9344c-19.264-19.2832-47.2128-22.592-62.4128-7.3728l-55.8592 55.8656c-15.1936 15.1744-11.904 43.1232 7.3856 62.3872l256.192 256.1856-256.192 256.2048c-19.2576 19.2512-22.592 47.1808-7.3856 62.3808l55.8592 55.8656c15.2 15.2 43.1488 11.904 62.4128-7.3536l256.1984-256.2048 256.16 256.1664c19.296 19.3024 47.2064 22.592 62.4064 7.392l55.8592-55.8656c15.1936-15.2 11.904-43.1296-7.3472-62.4064L622.8992 512 622.8992 512zM622.8992 512" fill="#272636" p-id="10443" />
                </svg>
              </div>
            </div>
          </div>
          {{ content }}
        </div>
      </main>
    </div>
  </div>
</template>

<style>
    .max_container{
        width: 300px;
        background-color: #2764de;
        border-radius: 0.5rem;
    }
    .fibonaHelper__popup {
        background-color: white;
        padding: 0.5rem 0 1rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        max-width: 100vw;
        min-width: 20vw;
    }
    .fibonaHelper__title__container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
        user-select: none;
        cursor: grab;
    }
    .fibonaHelper__img{
        width: 24px;
        height: 24px;
    }
    .fibonaHelper__title{
        background: linear-gradient(to right, #0000ff, #800080);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 15px;
        text-align: center;
    }
    .iconbutton {
        cursor: pointer;
    }
</style>
