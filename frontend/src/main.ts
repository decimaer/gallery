import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import apolloClient from './apollo-client'
import { ApolloClients } from '@vue/apollo-composable'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.provide(ApolloClients, {
  default: apolloClient
})

app.mount('#app')
