import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginCredentials } from './types'
import apolloClient from '@/apollo-client'
import Cookies from 'js-cookie'

import router from '@/router/index'
import { gql } from '@apollo/client/core'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: ref(false),
    isLoginError: ref(false)
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      const { email, password } = credentials

      try {
        const response = await apolloClient.mutate({
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
        console.log('LOGIN', response)

        if (response.errors)
          response.errors.forEach((error) => {
            throw new Error(error.message)
          })

        Cookies.set('signedin', 'true')
        Cookies.set('email', response.data.loginUser.email)

        const userStore = useUserStore()
        userStore.user = response.data.loginUser

        this.isLoginError = false
        this.isLoggedIn = true
        router.push('/gallery')
      } catch (error) {
        this.isLoginError = true
        console.error(error)
      }
    },
    logout() {
      Cookies.remove('signedin')
      Cookies.remove('email')
      this.isLoggedIn = false
      router.push('/')
    }
  }
})
