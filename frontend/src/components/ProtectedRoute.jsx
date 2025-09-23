import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
export default function ProtectedRoute({ roles=[], children }){
  const { user } = useAuth(); const loc=useLocation();
  if(!user) return <Navigate to="/login" state={{from:loc.pathname}} replace/>;
  if(roles.length && !roles.includes(user.role)) return <Navigate to="/not-authorized" replace/>;
  return children;
}
