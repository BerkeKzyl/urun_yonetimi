import React from 'react';
import ProductList from '../components/ProductList';

function Home() {
  return (
    <div>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2.5rem',
        color: '#333'
      }}>
        Ürün Kataloğu
      </h1>
      <ProductList />
    </div>
  );
}

export default Home;
