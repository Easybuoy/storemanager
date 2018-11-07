this.url = 'http://localhost:3000';

const request = (url, method = '', payload = '', authorized = false) => {

  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (method === 'POST' || method === 'PUT') {
    if (payload) {
      options.body = JSON.stringify(payload);
    } 
  }


  if (authorized) {
    options.headers.Authorization = localStorage.getItem('token');
  }

  // if (method === 'GET' || method === 'HEAD') {
  // return fetch(`${this.url}${url}`);
  // }
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
