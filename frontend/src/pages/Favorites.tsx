import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../context/AuthContext';

const GET_FAVORITE_PRODUCTS = gql`
  query GetFavoriteProducts {
    favoriteProducts {
      id
      name
      description
      price
      stock
      imageUrl
      createdAt
    }
  }
`;

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($productId: ID!) {
    removeFavorite(productId: $productId) {
      success
      message
    }
  }
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
}

interface FavoriteProductsData {
  favoriteProducts: Product[];
}

interface RemoveFavoriteResponse {
  removeFavorite: {
    success: boolean;
    message: string;
  };
}

function Favorites() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery<FavoriteProductsData>(GET_FAVORITE_PRODUCTS, {
    skip: !user
  });
  const [removeFavorite] = useMutation<RemoveFavoriteResponse>(REMOVE_FAVORITE);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const result = await removeFavorite({
        variables: { productId }
      });
      
      if (result.data?.removeFavorite?.success) {
        alert(result.data.removeFavorite.message);
        refetch(); 
      }
    } catch (error) {
      alert('Hata oluştu');
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Favorilerinizi görmek için giriş yapın</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Favorileriniz yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>Hata: {error.message}</p>
      </div>
    );
  }

  const favorites = data?.favoriteProducts || [];

  return (
    <div style={{ margin: '40px 0' }}>
      <h2 style={{ 
        fontSize: '2rem', 
        color: '#333', 
        marginBottom: '30px',
        textAlign: 'center' 
      }}>
         Favorilerim
      </h2>

      {favorites.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#666' }}>Henüz favori ürününüz yok</h3>
          <p style={{ color: '#888' }}>
            Ürün kataloğundan favori ürünlerinizi ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '0 20px'
        }}>
          {favorites.map((product: any) => (
            <div 
              key={product.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ 
                fontSize: '1.4rem', 
                color: '#333', 
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {product.name}
              </h3>

              <p style={{ 
                color: '#666', 
                lineHeight: '1.5',
                marginBottom: '15px'
              }}>
                {product.description}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold', 
                  color: '#007bff' 
                }}>
                  ₺{product.price}
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: product.stock > 0 ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
                </span>
              </div>

              <button
                onClick={() => handleRemoveFavorite(product.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                Favoriden Çıkar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;