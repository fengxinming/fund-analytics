import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
// import { Button, InputTag } from '@arco-design/web-vue';
// import '@arco-design/web-vue/es/style/index.css'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import "./styles/base.styl";

const app = createApp(App);

app
  .use(createPinia())
  .use(ArcoVue);
  // .use(Button)
  // .use(InputTag);

app.mount('#app');
