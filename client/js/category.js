const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('id')) {
    const categoryId = urlParams.get('id');
    let status = 0;

    request(`/categories/${categoryId}`, 'GET')
    .then(res => {
        status = res.status;
    return res.json();
    })
    .then(data => {
        switch (status) {
            case 200:
            // const 
            let categoryname = document.getElementById('categoryname');
            let createcategorysubmit = document.getElementById('createcategorysubmit');
            categoryname.value = data.data.name;
           return createcategorysubmit.value = 'Edit Category';
            break;
              case 404:
                alert(data.message);
              break;
            default:
               alert('Error Fetching Category, Try again');
               return window.location = '/admin_category.html';
          }
    }); 
}

const viewCategories = () => {
    let status = 0;
    request('/categories/', 'GET')
    .then(res => {
        status = res.status;
    return res.json();
    })
    .then(data => {
        switch (status) {
            case 200:
            let categorytablebody = document.getElementById('categorytablebody');
            let output = '';
          data.data.map((category) => {
             output += `
             <tr>
             <td data-label="Category Name">${category.name}</td>
             <td data-label="Edit"><button class="button_1"><a href="admin_category.html?id=${category.id}">EDIT</a></button></td>
             <td data-label="Delete"><button onclick="deleteCategory('${category.id}')" class="button_2">Delete</button></td>
           </tr>
              `;
    
          });
          categorytablebody.innerHTML = output;
              break;
              case 404:
                alert(data.message);
              break;
            default:
              return alert('Error Fetching Category, Try again');
          }
    }); 
};

const deleteCategory = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
        let status = 0;
      request(`/categories/${id}`, 'DELETE')
      .then(res =>{
          status = res.status;
          return res.json();
      })
      .then(data => {
          switch (status) {
              case 200:
                alert('Category Deleted Successfully');
                window.location.reload();
                break;
              default:
                return alert('Error Deleting Category, Try again');
            }
      })
      }
};

// const createCategory = () => {
    document.getElementById('createcategorysubmit').addEventListener('click', (e) => {
        e.preventDefault();
        let status = 0;
        const createcategorysubmit = document.getElementById('createcategorysubmit').value;
        const categoryname = document.getElementById('categoryname').value;

        const categoryId = urlParams.get('id');
        if (createcategorysubmit === 'Edit Category') {
            request(`/categories/${categoryId}`, 'PUT', { name: categoryname })
            .then(res => {
                status = res.status;
              return res.json();
            })
            .then(data => {

                switch (status) {
                    case 200:
                      alert(data.message);
                      window.location = '/admin_category.html';
                      break;
                      case 400:
                        alert(data.message);
                       break;
                    default:
                      return alert('Error Updating Category, Try again');
                  }
        });
        }else{
            request('/categories/', 'POST', { name: categoryname })
            .then(res => {
                status = res.status;
              return res.json();
            })
            .then(data => {
                console.log(data)
                switch (status) {
                    case 201:
                      alert(data.message);
                      window.location = '/admin_category.html';
                      break;
                      case 400:
                        alert(data.data.name || data.message);
                       break; 
                       case 409:
                        alert(data.message);
                       break;
                    default:
                      return alert('Error Creating Category, Try again');
                  }
        });
        }

        
    });
   
// };
