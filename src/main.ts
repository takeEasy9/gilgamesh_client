import App from '@/App.vue'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import 'element-plus/dist/index.css'
// 自定义样式
import '@/styles/index.scss';


const app = createApp(App)
// 将 ElementPlus 组件库中的所有图标注册到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).mount('#app')
