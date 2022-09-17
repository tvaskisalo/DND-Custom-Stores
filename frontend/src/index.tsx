import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'
import './index.css'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  //If token is found in browser storage, automatically use it
  const token = localStorage.getItem('DnD-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(new HttpLink())
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>
)
