export const localStorageKeys = {
  USER: "user",
};

export function getLocalStorage(key: string) {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key)!)
    : null;
}
export function setLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}
export function clearLocalStorage() {
  localStorage.clear();
}
