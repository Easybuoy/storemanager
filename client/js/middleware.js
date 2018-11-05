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

if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  const checkToken = () => {
    if (localStorage.getItem('token') === null) {
      return window.location = `index.html`;
    }
  };
  checkToken();
}
