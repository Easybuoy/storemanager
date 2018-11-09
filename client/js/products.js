const getProductsAttendantsView = () => {
    request('/products/', 'GET')
  .then(res => res.json())
  .then(data => {
      let productview = document.getElementById('productview');

                let output = '';

      data.data.map((product) => {
          let product_image = `${this.base_url}${product.product_image}`;
         output += `
            <div class="card">
                <a href="view_product_details.html/${product.id}"><img src="${product_image}" class="cardimg"></a>
        
                <div class="text-center cardbody" >
                    <h3 id="productname">${product.name}</h3>
                    <p>${product.description.substring(0, 50)}...</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p  id="productamount">Price: $${product.price}</p>
                    <input type="number" id="number" name="amount" placeholder="Quantity" >
                    <button class="button_1" onclick="addtocart('Google Pixel 2', '$649')">Add To Cart</button>
                </div>
        
            </div>      
          `;

      })

      productview.innerHTML = output;
      });
}


const getProductsAdminView = () => {
  request('/products/', 'GET')
  .then(res => res.json())
  .then(data => {
      let adminproductview = document.getElementById('adminproductview');
      console.log(data)
                let output = '';

      data.data.map((product) => {
          let product_image = `${this.base_url}${product.product_image}`;
         output += `
            <div class="card">
                    <a href="view_product_details.html"><img src="${product_image}" class="cardimg"></a>

                    <div class="text-center cardbody" >
                    <h3 id="productname" >${product.name}</h3>
                    <p>${product.description.substring(0, 50)}...</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p  id="productamount">Price: $${product.price}</p>
                    <button class="button_1"><a href="admin_edit_product.html?id=${product.id}">EDIT</a></button>
                    <button class="button_2" onclick="deleteProduct(${product.id})">DELETE</button>
                    </div>

            </div>
          `;

      })

      productview.innerHTML = output;
      });
}

const createProduct = () => {
    let status = 0;
    // Make request To Get All Categories
    request('/categories', 'GET')
    .then(res => {
        status = res.status;
        return res.json();
    })
    .then(data => {
        if (status === 200) {
            let categoryoption = document.getElementById('categoryoption');
            let output = '<option value="">Select Category</option>';
            data.data.map((category) => {
                output += `<option value="${category.id}">${category.name}</option>`;
            });
      categoryoption.innerHTML = output;
        }
        })

    document.getElementById('createproductsubmit').addEventListener('click', (e) =>{
    e.preventDefault();
    // createProduct();
     let productname = document.getElementById('productname').value;
    let productdescription = document.getElementById('productdescription').value
    let productprice = document.getElementById('productprice').value;
    let productquantity = document.getElementById('productquantity').value;
    let productimage = document.getElementById('productimage').files[0];
    let categoryid = document.getElementById('categoryoption').value;
    console.log(categoryid)
    let status = 0;
const formData = new FormData();

    formData.append('productImage', productimage);
    formData.append('name', productname);
    formData.append('description', productdescription);
    formData.append('price', productprice);
    formData.append('quantity', productquantity);
    if (categoryid) {
    formData.append('category_id', categoryid);
    }
    request('/products/', 'POST', formData, true)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
        const response = data.data;

        switch (status) {
        case 201:
        alert(data.message)
        window.location.reload();
        break;
        case 400:
          if (response.name && response.description && response.price && response.quantity) {
            return alert('Missing required fields');
          }
          alert(response.name || response.description || response.price || response.quantity);
          break;
        case 401:
           alert('Kindly login to create product');
            break;
        default:
          return alert('Error creating product. Please try again');
      }
    })
    .catch(err => {
        alert('Error creating product. Please try again');
    })

});
   
}

// document.getElementById('createproductsubmit').addEventListener('click', (e) =>{
//     e.preventDefault();
//     // createProduct();
// });
