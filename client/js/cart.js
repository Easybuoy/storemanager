const addToCart = (productId, productImage, productPrice) => {
    console.log(productImage)
  const products = {
    productId,
    productImage,
    productPrice
  };
  const totalcartitems = JSON.parse(localStorage.getItem('products'));
  // If nothing is in cart add new item
  if (totalcartitems === null) {
    const data = [];

    data.push(products);
    localStorage.setItem('products', JSON.stringify(data));
    return showCartCount();
  }
  // Else push to what is existing in cart.
  totalcartitems.push(products);
  localStorage.setItem('products', JSON.stringify(totalcartitems));      
    showCartCount();
};

const showCart = () => { 
    // localStorage.removeItem('products')
    let cartItems = JSON.parse(localStorage.getItem('products'));
    let carttablebody = document.getElementById('carttablebody');
  let output = '';

    // check if cart is empty 
    if (cartItems === null) {
       return alert('Cart Is Empty');
    }

    
    cartItems.map((item) => {
        let productImage = `${this.base_url}${item.productImage}`;
        output += `
        <tr>
        <td data-label="Item(s)"><img src="${productImage}" class="cardimg"></td>
        <td data-label="Quantity"> <input type="number" id="quantity-${item.productId}" name="quantity" value="1" placeholder="Quantity" > </td>
        <td data-label="Price">$${item.productPrice}</td>
        <td><button class="button_2" onclick="removeProductFromCart('${item.productId}')">Remove</button></td>
        </tr>
        `;
    });
    carttablebody.innerHTML = output;
};

const removeProductFromCart = (productId) => {
  let cartItems = JSON.parse(localStorage.getItem('products'));
  cartItems.map((item, i) => {
    if (item.productId === productId) {
      cartItems.splice(i, 1);

      localStorage.setItem('products', JSON.stringify(cartItems));      
    }
  });
  window.location.reload();
}

// This function appends the total item in cart to the cart image on the frontend
const showCartCount = () => {
  let length = 0;
  const totalcartitem = JSON.parse(localStorage.getItem('products'));
  if (totalcartitem) {
   length = totalcartitem.length;
  }
  document.getElementById('shoppingcartlabel').innerHTML = length;
};

showCartCount();

const checkout = () => {
    if (confirm('Are you sure you want to checkout now?')){
        const totalcartitems = JSON.parse(localStorage.getItem('products'));

        if (totalcartitems === null) {
          return  alert('Cart is empty');
        }
        const order = [];
        totalcartitems.map((product) => {
            let quantity = document.getElementById(`quantity-${product.productId}`).value;
            quantity = Number(quantity);
            const productRequested = {
                product_id: product.productId,
                quantity,
            };
        order.push(productRequested);
        });
        let status = 0;
        request('/sales/', 'POST', { order })
        .then(res => {
            status = res.status;
            return res.json()
            })
        .then(data => {
            console.log(data)
            switch (status) {
                case 201:
                alert(data.message)
                localStorage.removeItem('products');
                window.location.reload();
                break;
                case 400:
                  alert(data.message);
                  break;
                case 401:
                   alert('Kindly login to create sale');
                    break;
                default:
                  return alert('Error creating sale. Please try again');
              }
        });
    }
};
