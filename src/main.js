import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI)

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
