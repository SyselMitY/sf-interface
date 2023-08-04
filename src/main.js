import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App.vue";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./registerServiceWorker";

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
