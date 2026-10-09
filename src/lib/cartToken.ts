const TOKEN_KEY = "mc_cart_token";
const LOCAL_CART_KEY = "mc_cart_local";

export function getCartToken(): string {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function clearCartToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export const LOCAL_CART_KEY_NAME = LOCAL_CART_KEY;

export function readLocalCart<T>(): T | null {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocalCart<T>(cart: T): void {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}