let username = '';
let password = '';
let status = 0;

document.getElementById('loginsubmit').addEventListener('click', (e) =>{
  e.preventDefault();
  username = document.getElementById('loginusername').value;
  password = document.getElementById('loginpassword').value;

  fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: username,
      password,
    }),
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      console.log(status)
      if (status === 200) {

      } 
      switch (status) {
        case 200:
           localStorage.setItem('token', data.token);
            break;
        case 400:
          if (data.data.email && data.data.password) {
            return alert('Email & Password fields are required')
          }
          alert(data.data.email || data.data.password);
          break;
        case 401:
           alert(data.data.password)
            break;
        default:
          return alert('Error loggin in');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
