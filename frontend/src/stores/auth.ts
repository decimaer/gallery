import { defineStore } from 'pinia'
import type { LoginCredentials } from './types'
import apolloClient from '@/apollo-client'

import router from '@/router/index'
import { gql } from '@apollo/client/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isLoginError: false
  }),
  actions: {
    async authenticate() {
      const token = localStorage.getItem('token')

      if (!token) return

      const { data } = await apolloClient.mutate({
        mutation: gql`
                    mutation Auth {
                      User(token: "${token}") {
                        email
                        name
                      }
                    }
                  `
      })
      console.log('DATA', data)
      if (!data.authUser) return

      this.isLoggedIn = true
    },
    async login(credentials: LoginCredentials) {
      const { email, password } = credentials

      const { data } = await apolloClient.mutate({
        mutation: gql`
                    mutation Login {
                      loginUser(email: "${email}", password: "${password}") {
                        email
                        name
                        token
                      }
                    }
                  `
      })
      console.log('DATA', data)
      if (!data.loginUser) {
        this.isLoginError = true
        return
      }

      localStorage.setItem('token', data.loginUser.token)

      this.isLoginError = false
      this.isLoggedIn = true
      router.push('/gallery')
    },
    logout() {
      this.isLoggedIn = false
    }
  }
})
