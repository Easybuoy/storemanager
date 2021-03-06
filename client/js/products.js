const getProductsAttendantsView = () => {
  request('/products/', 'GET')
    .then(res => res.json())
    .then((data) => {
      const productview = document.getElementById('productview');

      let output = '';

      data.data.map((product) => {
        const product_image = `${this.base_url}${product.product_image}`;
        output += `
            <div class="card">
                <a href="view_product_details.html?id=${product.id}"><img src="${product_image}" class="cardimg"></a>
        
                <div class="text-center cardbody" >
                    <h3 id="productname">${product.name}</h3>
                    <p>${product.description.substring(0, 50)}...</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p  id="productamount">Price: $${product.price}</p>
                    <input type="number" id="quantity-${product.id}" name="quantity" placeholder="Quantity" >
                    <button class="button_1" onclick="addToCart('${product.id}', '${product.product_image}', '${product.price}')">Add To Cart</button>
                </div>
        
            </div>      
          `;

      });
      productview.innerHTML = output;
    });
};

const getProductsAdminView = () => {
  request('/products/', 'GET')
    .then(res => res.json())
    .then((data) => {
      const adminproductview = document.getElementById('adminproductview');
      let output = '';

      data.data.map((product) => {
        const product_image = `${this.base_url}${product.product_image}`;
        output += `
            <div class="card">
                    <a href="view_product_details.html?id=${product.id}"><img src="${product_image}" class="cardimg"></a>

                    <div class="text-center cardbody" >
                    <h3 id="productname" >${product.name}</h3>
                    <p>${product.description.substring(0, 50)}...</p>
                    <p>Quantity: ${product.quantity}</p>
                    <p  id="productamount">Price: $${product.price}</p>
                    <button class="button_1"><a href="admin_edit_product.html?id=${product.id}">EDIT</a></button>
                    <button class="button_2" onclick="deleteProduct('${product.id}')">DELETE</button>
                    </div>

            </div>
          `;

      });

      adminproductview.innerHTML = output;
    });
};

const createProduct = () => {
  let status = 0;
  // Make request To Get All Categories
  request('/categories', 'GET')
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      if (status === 200) {
        const categoryoption = document.getElementById('categoryoption');
        let output = '<option value="">Select Category</option>';
        data.data.map((category) => {
          output += `<option value="${category.id}">${category.name}</option>`;
        });
        categoryoption.innerHTML = output;
      }
    });

  document.getElementById('createproductsubmit').addEventListener('click', (e) => {
    e.preventDefault();
    // createProduct();
    const productname = document.getElementById('productname').value;
    const productdescription = document.getElementById('productdescription').value;
    const productprice = document.getElementById('productprice').value;
    const productquantity = document.getElementById('productquantity').value;
    const productimage = document.getElementById('productimage').files[0];
    const categoryid = document.getElementById('categoryoption').value;

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
      .catch((err) => {
        alert('Error creating product. Please try again');
      });

  });
};


const deleteProduct = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    let status = 0;
    request(`/products/${id}`, 'DELETE')
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        switch (status) {
          case 200:
            alert('Product Deleted Successfully');
            window.location.reload();
            break;
          default:
            return alert('Error Deleting Product, Try again');
        }
      });
  }
};
// document.getElementById('createproductsubmit').addEventListener('click', (e) =>{
//     e.preventDefault();
//     // createProduct();
// });

function showImage() {
  if (this.files && this.files[0]) {
    const obj = new FileReader();
    obj.onload = (data) => {
      const image = document.getElementById('showimage');
      image.src = data.target.result;
      image.style.display = 'block';
      image.style.justifyContent = 'center';
    };
    obj.readAsDataURL(this.files[0]);
  }
}

const getProductsById = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const productId = urlParams.get('id');

  request(`/products/${productId}`, 'GET')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const response = data.data;
      console.log(data);
      const productname = document.getElementById('productname');
      const productsummary = document.getElementById('productsummary');
      const productamount = document.getElementById('productamount');
      const productquantity = document.getElementById('productquantity');
      const productimage = document.getElementById('productimage');
      const categoryoption = document.getElementById('categoryoption');
      const image = document.getElementById('showimage');
      image.src = response.product_image;
      image.style.display = 'block';
      image.style.justifyContent = 'center';

      productname.value = response.name;
      productsummary.value = response.description;
      productamount.value = `$${response.price}`;
      productquantity.value = response.quantity;

    });
};
