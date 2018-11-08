this.url = 'http://localhost:3000';

const request = (url, method, payload = null) => {
  let token = localStorage.getItem('token') || null;
  if (payload !== null) {
    payload = JSON.stringify(payload)
  }

  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    method,
    body: payload,
  }

  return fetch(`${this.url}${url}`, options);
};

if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  const checkToken = () => {
    // If no token in localstorage, redirrect to login
    if (localStorage.getItem('token') === null) {
      return window.location = `index.html`;
    }

    // check if token has expired or not
    let token = localStorage.getItem('token');
    token = token.split(' ')[1];
    function parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    };

    let decodedToken = parseJwt(token);

    if (decodedToken.exp < Date.now() / 1000) {
      return window.location = `index.html`;
    }
  };
  checkToken();
}
