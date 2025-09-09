import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '15px 0',
        marginBottom: '20px'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div>Yükleniyor...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #ddd',
      padding: '15px 0',
      marginBottom: '20px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/" style={{
            textDecoration: 'none',
            fontSize: '1.8rem',
            color: '#333',
            fontWeight: 'bold'
          }}>
             Ürün Yönetimi
          </Link>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{
              textDecoration: 'none',
              color: '#007bff',
              fontSize: '1rem',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
               Ürünler
            </Link>

            {user && (
  <Link to="/favorites" style={{
    textDecoration: 'none',
    color: '#666',
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
     Favorilerim
  </Link>
)}

{user?.isStaff && (
  <Link to="/admin" style={{
    textDecoration: 'none',
    color: '#666',
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
     Admin Panel
  </Link>
)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{
                color: '#666',
                fontSize: '0.9rem',
                marginRight: '10px'
              }}>
                Hoş geldin, {user.firstName || user.username}!
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                  Giriş Yap
                </button>
              </Link>

              <Link to="/register">
                <button style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                  Kayıt Ol
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
