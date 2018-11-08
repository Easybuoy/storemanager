  

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
                <a href="view_product_details.html"><img src="${product_image}" class="cardimg"></a>
        
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
    let productimage = document.getElementById('productimage').value;

    console.log(productname)
        console.log(productdescription)
    console.log(productprice)
    console.log(productquantity)
    console.log(productimage)

    request('/api/v1/products/', 'POST', {name: productname, description: productdescription, price: productprice, quantity: productquantity, productImage: productimage})
    .then(res => res.json())
    .then(data => console.log(data))

}

document.getElementById('createproductsubmit').addEventListener('click', (e) =>{
    e.preventDefault();
    createProduct();
});
