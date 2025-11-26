import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

declare function ProtectedRoute(props: ProtectedRouteProps): JSX.Element | null;

export default ProtectedRoute;

