import cookies from "js-cookie";

const cookieConfig = {
  path: "/",
  domain: window.location.hostname,
  expires: 1,
};

export const cookieKeys = {
  TOKEN: "token",
};

export function getCookie(key: string): unknown {
  return cookies.get(key) ? JSON.parse(cookies.get(key)!) : null;
}

export function setCookie(key: string, value: unknown, config = cookieConfig) {
  cookies.set(key, JSON.stringify(value), {
    ...cookieConfig,
    ...config,
  });
}

export function removeCookie(key: string, config = cookieConfig) {
  cookies.remove(key, {
    ...cookieConfig,
    ...config,
  });
}

export function clearCookies() {
  Object.values(cookieKeys).forEach((key) => {
    removeCookie(key);
  });
}
