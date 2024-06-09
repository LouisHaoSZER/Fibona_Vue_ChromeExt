<script setup lang="ts">
// import { storageDemo } from '~/logic/storage'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

const btnList = [
  {
    text: '弹窗',
  },
]

// function injectScript() {
//   browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, {
//       action: 'injectScript',
//       script: 'alert("Hello, World!")',
//     })
//   })
// }
</script>

<template>
  <main class="p-3 w-50">
    <div>
      <div
        class="p-3  text-center text-sm font-bold"
      >
        请选择注入的脚本
      </div>
      <div class="flex flex-col space-y-2">
        <button
          v-for="btn in btnList"
          :key="btn.text"
          class="btn btn-primary"
        >
          {{ btn.text }}
        </button>
      </div>
    </div>
  </main>
</template>

<style>

</style>
