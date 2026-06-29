import { auth as _auth, type User, type AccountType } from "./api";

export type { User, AccountType };

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  accountType: AccountType;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInData) {
  const { user, error } = await _auth.signIn(email, password);
  if (error) return { data: null, error: { message: error } };
  return { data: { user }, error: null };
}

export async function signUp({
  email,
  password,
  fullName,
  accountType,
}: SignUpData) {
  const { user, error } = await _auth.signUp(
    email,
    password,
    fullName,
    accountType
  );
  if (error) return { data: null, error: { message: error } };
  return { data: { user }, error: null };
}

export async function signOut() {
  _auth.signOut();
  return { error: null };
}

export function getCurrentUser(): User | null {
  return _auth.getCurrentUser();
}

export async function resetPassword(
  email: string
): Promise<{ error: { message: string } | null }> {
  const { error } = await _auth.resetPassword(email);
  if (error) return { error: { message: error } };
  return { error: null };
}
