import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
  credentials: 'include'
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export default apolloClient
