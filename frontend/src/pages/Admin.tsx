import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
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

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
      product {
        id
        name
        price
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
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

interface ProductsData {
  products: Product[];
}

interface CreateProductResponse {
  createProduct: {
    success: boolean;
    message: string;
    product: {
      id: string;
      name: string;
      price: string;
    };
  };
}

interface DeleteProductResponse {
  deleteProduct: {
    success: boolean;
    message: string;
  };
}

function Admin() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });

  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery<ProductsData>(GET_PRODUCTS);
const [createProduct] = useMutation<CreateProductResponse>(CREATE_PRODUCT);
const [deleteProduct] = useMutation<DeleteProductResponse>(DELETE_PRODUCT);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createProduct({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            imageUrl: formData.imageUrl || null
          }
        }
      });
  
      if (result.data?.createProduct?.success) {
        alert(result.data.createProduct.message);
        setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
        refetchProducts();
      }
    } catch (error) {
      alert('Ürün eklenirken hata oluştu');
    }
  };


  const handleDelete = async (productId: string) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      const result = await deleteProduct({
        variables: { id: productId }
      });

      if (result.data?.deleteProduct?.success) {
        alert(result.data.deleteProduct.message);
        refetchProducts();
      }
    } catch (error) {
      alert('Ürün silinirken hata oluştu');
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Admin paneline erişmek için giriş yapın</h2>
      </div>
    );
  }

  if (!user.isStaff) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Bu sayfaya erişim yetkiniz yok</h2>
        <p>Sadece yöneticiler admin paneline erişebilir.</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>
        Admin Panel
      </h1>
      <div style={{
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
  maxWidth: '600px',
  margin: '0 auto 30px'
}}>
  <h3 style={{ marginBottom: '20px' }}>➕ Yeni Ürün Ekle</h3>
  <form onSubmit={handleSubmit}>
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        Ürün Adı:
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        Açıklama:
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
        rows={3}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          resize: 'vertical'
        }}
      />
    </div>

    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Fiyat (₺):
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Stok:
        </label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        Resim URL (opsiyonel):
      </label>
      <input
        type="url"
        value={formData.imageUrl}
        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>

    <button
      type="submit"
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer'
      }}
    >
      Ürün Ekle
    </button>
  </form>
</div>
      <p style={{ textAlign: 'center' }}>
        Hoş geldiniz, {user.firstName || user.username}! Burada ürünleri yönetebilirsiniz.
      </p>

      <div>
        <h3 style={{ marginBottom: '20px' }}> Mevcut Ürünler</h3>
        {productsLoading ? (
          <p>Ürünler yükleniyor...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {productsData?.products?.map((product: any) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#fff'
                }}
              >
                <h4 style={{ marginBottom: '10px', color: '#333' }}>{product.name}</h4>
                <p style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem' }}>
                  {product.description.substring(0, 100)}...
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                    ₺{product.price}
                  </span>
                  <span style={{ color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
                    Stok: {product.stock}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                   Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;