  

const me = () => {
    console.log('cjj')
    request('/api/v1/products/', 'GET', '', true)
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
      })
}