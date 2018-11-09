const login = () => {
  let email = '';
  let password = '';
  let status = 0;
  
  document.getElementById('loginsubmit').addEventListener('click', (e) =>{
    e.preventDefault();
    email = document.getElementById('loginusername').value;
    password = document.getElementById('loginpassword').value;
  
    request('/auth/login', 'POST', { email, password })
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
      .catch((err) => {
        return alert('Error loggin in');
      });
  });
};

const createAttendant = () => {
  document.getElementById('createattendant').addEventListener('click', (e) => {
    e.preventDefault();
    let status = 0;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let type = document.getElementById('type').value;

    request('/auth/signup', 'POST', { name, email, password, type, })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        const response = data.data;
        switch (status) {
          case 201:
            alert(data.message);
            window.location.reload();
            break;
          case 400:
            if (response.name && response.password && response.email && response.type) {
              return alert('Missing required fields');
            }
            alert(response.name || response.email || response.password || response.type);
            break;
          case 404:
            alert(response.email);
            break;
          case 401:
             alert(response.password);
              break;
          case 409:
             alert(response.email);
              break;
          default:
            return alert('Error Creating User, Try again');
        }
      })
      .catch((err) => {
        return alert('Error Creating User, Try again');
      });
  });
}