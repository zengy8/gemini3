const SESSION_KEY = 'nebula_auth_session';
const MOCK_PASSWORD = 'admin'; // Matches the hint in Login.tsx

export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
};

export const login = (password: string): boolean => {
  if (password === MOCK_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};