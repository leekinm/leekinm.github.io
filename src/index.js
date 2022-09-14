// 已经在index.html中加载Vue，可以方式使用
const vm = new Vue({
  template: `<div>
    <h1>Vue源码debug</h1>
  </div>`
})

vm.$mount('#app')

console.log(vm)
