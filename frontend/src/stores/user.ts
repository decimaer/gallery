import { defineStore } from 'pinia'
import apolloClient from '@/apollo-client'

import router from '@/router/index'
import { gql } from '@apollo/client/core'
import Cookies from 'js-cookie'
import type { RegisterUser, UserInfo } from './types'

export const useUserStore = defineStore('user', {
  state: (): { user: UserInfo | null } => ({
    user: null
  }),
  actions: {
    async registerUser(user: RegisterUser) {
      const { email, username, password, passwordConfirm } = user

      try {
        const response = await apolloClient.mutate({
          mutation: gql`
                      mutation RegisterUser {
                        createUser(email: "${email}", name: "${username}", password: "${password}", passwordConfirm: "${passwordConfirm}") {
                          email
                          id
                          name
                        }
                      }
                    `
        })
        console.log('REGISTER', response)

        if (response.errors)
          response.errors.forEach((error) => {
            throw new Error(error.message)
          })

        router.push('/login')
      } catch (error) {
        console.error(error)
      }
    },
    async getUser() {
      if (this.user) return

      const email = Cookies.get('email')
      if (!email) return router.push('/login')

      try {
        const response = await apolloClient.query({
          query: gql`
          query getUser {
            user(email: "${email}") {
              email
              id
              name
            }
          }
          `
        })
        console.log('USER', this.user)

        if (response.errors)
          response.errors.forEach((error) => {
            throw new Error(error.message)
          })

        this.user = response.data.user
      } catch (error) {
        console.error(error)
      }
    }
  }
})
