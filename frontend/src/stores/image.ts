import { defineStore } from 'pinia'
import { type Image } from './types'
import { useUserStore } from './user'
import router from '@/router'
import apolloClient from '@/apollo-client'
import { gql } from '@apollo/client/core'

export const useImageStore = defineStore('image', {
  state: (): { images: Image[] | [] } => ({
    images: []
  }),
  actions: {
    getImages: async function () {
      const userStore = useUserStore()
      const userId = userStore.user?.id

      if (!userId) return router.push('/login')

      const { data } = await apolloClient.query({
        query: gql`
          query getAllImages {
            images(userId: ${userId}) {
              path
            }
          }
          `
      })

      this.images = data.images || []

      console.log(data)
    }
  }
})
