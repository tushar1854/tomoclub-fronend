import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../../Context/AuthContext';

const ProtectedRoute = ({ entity = '', children }) => {
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  console.log('entity', entity);
  if (entity === 'moderator') {
    return <Navigate to="/session" />;
  }
  return children;
};

export default ProtectedRoute;
