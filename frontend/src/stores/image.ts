import { defineStore } from 'pinia'
import { type Image } from './types'
import { useUserStore } from './user'
import apolloClient from '@/apollo-client'
import { gql } from '@apollo/client/core'
import { useQuery, type UseQueryReturn } from '@vue/apollo-composable'
import { provideApolloClient } from '@vue/apollo-composable'

let hasfetchedOnce = false

type Query = UseQueryReturn<{ images: Image[] }, Record<string, never>>

export const useImageStore = defineStore('image', {
  state: (): { query: Query | null } => ({
    query: null
  }),
  getters: {
    getImages: (state) => {
      if (!state.query) return []
      return state.query.result?.images || []
    }
  },
  actions: {
    fetchImages: async function () {
      const { userId, getUser } = useUserStore()

      if (!userId) await getUser()
      // Vue works in mysterious ways
      const userId2 = useUserStore().userId
      const finalUserId = userId || userId2

      try {
        const query = provideApolloClient(apolloClient)(() =>
          useQuery<{ images: Image[] }>(gql`
            query getAllImages {
              images(userId: ${finalUserId}) {
                path
              }
            }
        `)
        )

        // Vue works in mysterious ways
        console.log(hasfetchedOnce)
        if (hasfetchedOnce) {
          console.log('refetch images')
          await query.refetch()
        }

        // @ts-ignore
        this.query = query || null
        hasfetchedOnce = true
      } catch (error) {
        console.error(error)
      }
    }
  }
})
