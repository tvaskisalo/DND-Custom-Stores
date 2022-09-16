import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'
import './index.css'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>
)
