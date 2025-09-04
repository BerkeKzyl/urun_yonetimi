import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import client from './apollo';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="container">
        <ProductList />
      </div>
    </ApolloProvider>
  );
}

export default App;
