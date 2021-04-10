/* eslint-disable */
function findRemoteFunc(list, funcList, blankList) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].type == 'grid') {
      list[i].columns.forEach((item) => {
        findRemoteFunc(item.list, funcList, blankList);
      });
    } else if (list[i].type == 'blank') {
      if (list[i].model) {
        blankList.push({
          name: list[i].model,
          label: list[i].name,
        });
      }
    } else if (list[i].options.remote && list[i].options.remoteFunc) {
      funcList.push({
        func: list[i].options.remoteFunc,
        label: list[i].name,
        model: list[i].model,
      });
    }
  }
}

export default function (data, type = 'vue') {
  const funcList = [];

  const blankList = [];

  findRemoteFunc(JSON.parse(data).list, funcList, blankList);

  let funcTemplate = '';

  let blankTemplate = '';

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              // ${funcList[i].label} ${funcList[i].model}
              // Call callback function once get the data from remote server
              // resolve(data)
            },
    `;
  }
  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- use v-model="scope.model.${blankList[i].name}" to bind data -->
        </template>
    `;
  }

  if (type == 'vue') {
    return `<template>
  <div>
    <ProForm :data="jsonData" :remote="remoteFuncs" :value="editData" ref="proForm">
      ${blankTemplate}
    </ProForm>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        jsonData: ${data},
        editData: {},
        remoteFuncs: {
          ${funcTemplate}
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.proForm.getData().then(data => {
          // data check success
          // data - form data
        }).catch(e => {
          // data check failed
        })
      }
    }
  }
</script>`;
  }
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <!-- 引入ProCrud CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-pro-crud/lib/ProCrud.css" />
    <!-- 引入ElementUI CSS -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"  />
  </head>
  <body>
    <div id="app">
      <pro-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="proForm">
        ${blankTemplate}
      </pro-form>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <!-- import Vue before Element -->
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <!-- import ElementUI -->
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <!-- import ElementProCrud -->
    <script src="https://cdn.jsdelivr.net/npm/element-pro-crud/lib/ProCrud.umd.js"></script>
    <!-- import ace.js for preview function in form generator  -->
    <script src="https://cdn.bootcdn.net/ajax/libs/ace/test/ace.js"></script>
    <script>
      new Vue({
        el: '#app',
        data: {
          jsonData: ${data},
          editData: {},
          remoteFuncs: {
            ${funcTemplate}
          }
        },
        methods: {
          handleSubmit () {
            this.$refs.proForm.getData().then(data => {
              // data check success
              // data - form data
            }).catch(e => {
              // data check failed
            })
          }
        }
      })
    </script>
  </body>
  </html>`;
}
