// src/pages/Register.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Get email from URL parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  return (
    <form>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {/* Add other registration fields */}
    </form>
  );
}

export default Register;