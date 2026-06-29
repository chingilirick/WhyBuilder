import { Navigate } from "react-router";
import { getCurrentUser } from "../../lib/auth";
import type { AccountType } from "../../lib/api";

interface ProtectedRouteProps {
  allowedRoles: AccountType[];
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  allowedRoles,
  children,
  redirectTo = "/auth?mode=login",
}: ProtectedRouteProps) {
  const user = getCurrentUser();

  if (!user) return <Navigate to={redirectTo} replace />;
  if (!allowedRoles.includes(user.account_type)) return <Navigate to="/" replace />;

  return <>{children}</>;
}