import React from 'react';
import { useAuth } from '../context/AuthContext';

function Admin() {
  const { user } = useAuth();

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
      <p style={{ textAlign: 'center' }}>
        Hoş geldiniz, {user.firstName || user.username}! Burada ürünleri yönetebilirsiniz.
      </p>
    </div>
  );
}

export default Admin;