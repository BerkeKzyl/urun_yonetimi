import React from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '../context/AuthContext';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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

const ADD_FAVORITE = gql`
  mutation AddFavorite($productId: ID!) {
    addFavorite(productId: $productId) {
      success
      message
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

const GET_FAVORITE_PRODUCTS = gql`
  query GetFavoriteProducts {
    favoriteProducts {
      id
      name
      price
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

interface ProductsData {
  products: Product[];
}

function ProductList() {
  const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS);
  const { user } = useAuth();
  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

  const { data: favoritesData } = useQuery(GET_FAVORITE_PRODUCTS, {
    skip: !user
  });

  const handleFavoriteClick = async (productId: string, isAdd: boolean) => {
    try {
      const mutation = isAdd ? addFavorite : removeFavorite;
      const result = await mutation({ 
        variables: { productId },
        refetchQueries: [{ query: GET_FAVORITE_PRODUCTS }]
      });
      
      const response = result.data?.[isAdd ? 'addFavorite' : 'removeFavorite'];
      alert(response?.message || 'İşlem tamamlandı');
    } catch (error) {
      alert('Hata oluştu');
    }
  };

  const isFavorite = (productId: string) => {
    return favoritesData?.favoriteProducts?.some(
      (fav: any) => fav.id === productId
    ) || false;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
           Ürünler yükleniyor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#fee',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#d00' }}>❌ Hata Oluştu</h3>
        <p style={{ color: '#800' }}>
          Detay: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0' }}>
      <h2 style={{ 
        fontSize: '2rem', 
        color: '#333', 
        marginBottom: '30px',
        textAlign: 'center' 
      }}>
         Ürün Kataloğu
      </h2>

      {data?.products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#666' }}> Henüz Ürün Yok</h3>
          <p style={{ color: '#888' }}>
            Admin panelinden ürün ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '0 20px'
        }}>
          {data?.products.map((product) => (
            <div 
              key={product.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
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

              {user && (
                <button
                  onClick={() => handleFavoriteClick(product.id, !isFavorite(product.id))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '15px',
                    backgroundColor: isFavorite(product.id) ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isFavorite(product.id) ? '❤️ Favoriden Çıkar' : '🤍 Favoriye Ekle'}
                </button>
              )}

              <div style={{ 
                fontSize: '0.8rem', 
                color: '#888',
                borderTop: '1px solid #eee',
                paddingTop: '10px'
              }}>
                Eklenme: {new Date(product.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;