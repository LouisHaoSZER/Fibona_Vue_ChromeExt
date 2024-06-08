<script setup lang="ts">
import { chain } from '../langchain/index'

// import { storageDemo } from '~/logic/storage'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

const btnList = [
  {
    text: 'AI 搜索',
  },
  {
    text: '上传文件',
  },
  {
    text: '写作助手',
  },
  {
    text: '艺术家',
  },
]

const opList = [
  {
    text: '总结网页',
  },
  {
    text: '翻译网页',
  },
  {
    text: '与网页聊天',
  },
]

const userQuestion = ref('')
const aiAnswer = ref('')
const Loading = ref('Wait for seconds, something is loading....')
const show = ref(true)

async function handleUserQuestion() {
  if (show.value)
    show.value = false
  if (aiAnswer.value)
    aiAnswer.value = ''
  if (!userQuestion.value)
    return
  const msg = userQuestion.value
  userQuestion.value = ''
  const res = (await chain.invoke({
    text: msg,
  })).join('')
  aiAnswer.value = res
}
</script>

<template>
  <main class="w-full h-100vh px-4 py-5 text-center text-gray-700 bg-#202020 flex flex-col gap-10">
    <div v-if="show" class="font-bold text-2xl relative mb-2 text-#f3f3f3">
      <span class="absolute left-3">你好，👋</span><br>
      <span class="absolute left-3">今天能帮你些什么?</span>
    </div>
    <div v-if="show" class="flex-1/3 flex flex-wrap gap-2 content-start justify-center text-#f3f3f3">
      <div v-for="(item, index) in btnList" :key="index" class="flex items-center bg-#323235 w-38 h-12 rounded-2 cursor-pointer text-4 font-bold">
        <div class="w-28px h-28px ml-2 mr-2 bg-#202020 rounded-1 p1">
          <img src="https://fibona-sdk-1253358381.cos.ap-guangzhou.myqcloud.com/icon_imgs/fibona-logo.png" alt="">
        </div>
        {{ item.text }}
      </div>
    </div>
    <div v-if="show" class="flex-1/3 ">
      <div class="mb-10">
        <span />
      </div>
      <span class="flex ml-2 mb-2 text-sm text-bluegray hover:bg-#323235" rounded-2 p1><a href="#">建议操作：Chrome插件开发指南 Manifest V3</a></span>
      <div v-for="(item, index) in opList" :key="index" style="border: 1px solid #323235" class="flex bg-#202020 items-center p-2 mb-2 rounded-2 text-4 font-bold cursor-pointer hover:bg-#323235">
        <img class=" w-24px h-24px ml-2 mr-2" src="https://fibona-sdk-1253358381.cos.ap-guangzhou.myqcloud.com/icon_imgs/fibona-logo.png" alt="">
        <span class="flex-9/10 flex">{{ item.text }}</span>
        <span class="flex-1/10">-></span>
      </div>
    </div>
    <div class="flex-1/3 ">
      <div v-if="show" class="flex flex-col-reverse items-start pb-2 pl-2">
        <div
          class="rounded-3 text-bluegray text-4 bg-#202020 p1 mt-1 cursor-pointer hover:bg-#323235"
          style="border: 1px solid #323235"
        >
          添加技能
        </div>
      </div>
      <div v-if="!show" class="text-white h-67% pt-20 text-sm font-bold">
        {{ aiAnswer || Loading }}
      </div>
      <div
        :class="show ? 'h-70%' : 'h-30%'"
      >
        <textarea
          v-model="userQuestion"
          class="w-full h-100% p-2 bg-#202020 text-white text-4 font-bold"
          style="border: 1px solid #323235"
          placeholder="按下'Ctrl+J'快速提问..."
          placeholder-class="textarea-placeholder"
        />
        <div class="flex">
          <div class="flex-4/5" />
          <div
            class="hover:bg-#8a939d w-20 h-20% bg-#c0c5cc text-white text-4 font-bold cursor-pointer rounded-2 flex-1/5 mt-2"
            @click="handleUserQuestion"
          >
            发送
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
  my_border{
    border: 1px solid #323235;
  }
</style>
