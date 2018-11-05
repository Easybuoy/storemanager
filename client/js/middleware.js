this.url = 'http://localhost:3000/';
const request = (url, method, payload) => {
  return fetch(`${this.url}api/v1/auth/login`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
