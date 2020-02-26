import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueChatScroll from 'vue-chat-scroll'
import Cookie from 'vue-cookies'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueChatScroll)
Vue.use(Cookie)

new Vue({
  render: h => h(App),
}).$mount('#app')
