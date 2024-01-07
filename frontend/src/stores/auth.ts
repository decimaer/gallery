import { defineStore } from 'pinia'
import type { LoginCredentials } from './types'
import apolloClient from '@/apollo-client'
import Cookies from 'js-cookie'

import router from '@/router/index'
import { gql } from '@apollo/client/core'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isLoginError: false
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      const { email, password } = credentials

      // add header credentials: 'include'?
      const { data } = await apolloClient.mutate({
        mutation: gql`
                    mutation Login {
                      loginUser(email: "${email}", password: "${password}") {
                        id
                        email
                        name
                      }
                    }
                  `
      })
      console.log('DATA', data)
      if (!data.loginUser) {
        this.isLoginError = true
        return
      }

      document.cookie = 'signedin=true'
      document.cookie = `email=${data.loginUser.email}`

      const userStore = useUserStore()
      userStore.user = data.loginUser

      this.isLoginError = false
      this.isLoggedIn = true
      router.push('/gallery')
    },
    logout() {
      Cookies.remove('signedin')
      Cookies.remove('jwt')
      this.isLoggedIn = false
      router.push('/')
    }
  }
})
