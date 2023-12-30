import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token')

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default apolloClient
