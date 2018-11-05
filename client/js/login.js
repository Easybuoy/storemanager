let username = '';
let password = '';
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
    .then(res => {
      if (res.status === 200) {
        return res.json();
    }
// else display alert error
})
    .then(data => {
      localStorage.setItem('token', data.token);
    })
    .catch(err => {
      console.log(err)
  });
});
