  

const me = () => {
    console.log('cjj')
    request('/api/v1/products/', 'GET')
  .then(res => res.json())
  .then(data => {
      let prodct = document.getElementById('prodct');
      console.log(data)
                let output = '';

      data.data.map((product) => {
          let product_image = `${this.url}/${product.product_image}`;
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

      prodct.innerHTML = output;
      });
}

const createProduct = () => {
    let productname = document.getElementById('productname').value;
    let productdescription = document.getElementById('productdescription').value
    let productprice = document.getElementById('productprice').value;
    let productquantity = document.getElementById('productquantity').value;
    let productimage = document.getElementById('productimage').files[0];
    let status = 0;
const formData = new FormData();

formData.append('productImage', productimage);
formData.append('name', productname);
formData.append('description', productdescription);
formData.append('price', productprice);
formData.append('quantity', productquantity);

    request('/api/v1/products/', 'POST', formData, true)
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
        const response = data.data;

        switch (status) {
        case 201:
        alert(data.message)
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

}

document.getElementById('createproductsubmit').addEventListener('click', (e) =>{
    e.preventDefault();
    createProduct();
});
