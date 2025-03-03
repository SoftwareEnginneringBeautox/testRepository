// ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  // For this example, we check localStorage for a token
  // You could also check a context or global state.
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/Login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

