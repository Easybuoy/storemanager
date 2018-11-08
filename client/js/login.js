let email = '';
let password = '';
let status = 0;

document.getElementById('loginsubmit').addEventListener('click', (e) =>{
  e.preventDefault();
  email = document.getElementById('loginusername').value;
  password = document.getElementById('loginpassword').value;

  request('/api/v1/auth/login', 'POST', { email, password })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      const response = data.data;
      switch (status) {
        case 200:
           localStorage.setItem('token', response.token);

           if (response.type == 1) {
            return window.location = 'admin_dashboard.html';
           }

           window.location = 'attendant_dashboard.html';
            break;
        case 400:
          if (response.email && response.password) {
            return alert('Email & Password fields are required');
          }
          alert(response.email || response.password);
          break;
        case 404:
          alert(response.email);
          break;
        case 401:
           alert(response.password);
            break;
        default:
          return alert('Error loggin in');
      }
    })
    .catch((err) => { console.log(err)
      return alert('Error loggin in');
    });
});
