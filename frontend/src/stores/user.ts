import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginCredentials } from './types'
import { useRouter } from 'vue-router'
import apolloClient from '@/apollo-client'

import router from '@/router/index'
import { gql } from '@apollo/client/core'
import Cookies from 'js-cookie'

type RegisterUser = {
  email: string
  username: string
  password: string
  passwordConfirm: string
}

type UserInfo = {
  name: string
  email: string
  id: string
}

export const useUserStore = defineStore(
  /* <
  'user',
  { user: UserInfo | null }
  // { registerUser(): void }
> */ 'user',
  {
    state: (): { user: UserInfo | null } => ({
      user: null
    }),
    actions: {
      async registerUser(user: RegisterUser) {
        const { email, username, password, passwordConfirm } = user

        const { data } = await apolloClient.mutate({
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
        console.log(data)
        router.push('/login')
      },
      async getUser() {
        if (this.user) return

        const email = Cookies.get('email')
        if (!email) return router.push('/login')

        const { data } = await apolloClient.query({
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

        if (data.user) this.user = data.user
      }
    }
  }
)
