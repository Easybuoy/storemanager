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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const type = document.getElementById('type').value;
    const userImage = document.getElementById('userimage').files[0];

    const formData = new FormData();

    formData.append('userImage', userImage);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (type) {
      formData.append('type', type);
    }

    request('/auth/signup', 'POST', formData, true)
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
};

const viewAllAttendants = () => {
  let status = 0;
  request('/auth/attendants', 'GET')
  .then(res => {
    status = res.status;
      return res.json();
  })
  .then(data => {
    switch (status) {
      case 200:
      let adminviewattendants = document.getElementById('adminviewattendants');
    let output = '';

      data.data.map((attendant) => {
      let attendant_image = `${this.base_url}${attendant.userimage}`;
      output += `
      <div class="card">
        <a><img src="${attendant_image}" class="cardimg"></a>
                    
      <div class="text-center cardbody" >
        <h3 id="productname">Name: ${attendant.name}</h3>
        <p>Email: ${attendant.email}</p>
        <p>Attendance: -</p>
        <p>Product Sold: -</p>
        <button class="button_3" >Promote</button>
        <button class="button_2" >Delete</button>
      </div>
                    
      </div>
      `;

      })

      adminviewattendants.innerHTML = output;
      break;
      case 400:
        alert(data.message);
        break;
        case 404:
        alert(data.message);
         break;
        case 401:
         alert('Kindly login to view attendants');
          break;
      default:
        return alert('Error Fetching Attendants, Please try again');
    }
    console.log(data)
    
  })
};

const getAttendantProfile = () => {
  request('/auth/current', 'GET')
  .then(res => res.json())
  .then(data =>{
     let role = 'Store Attendant';
     if (data.data.type === 2) {
       role = 'Admin';
     }
     
    document.getElementById('profileimg').src = data.data.userImage;
    document.getElementById('profilename').innerHTML = data.data.name;
    document.getElementById('profileemail').innerHTML = data.data.email;
    document.getElementById('profilerole').innerHTML = role;
    document.getElementById('profilestatus').innerHTML = 'Active';

    })
}