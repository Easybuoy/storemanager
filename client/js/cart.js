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

    console.log(cartItems)
    // check if cart is empty 
    if (cartItems === null) {
       return alert('Cart Is Empty');
    }

    
    cartItems.map((item) => {
        let productImage = `${this.base_url}${item.productImage}`;
        output += `
        <tr>
        <td data-label="Item(s)"><img src="${productImage}" class="cardimg"></td>
        <td data-label="Quantity"> <input type="number" id="product-${item.productId}" name="quantity" value="1" placeholder="Quantity" > </td>
        <td data-label="Price">$${item.productPrice}</td>
        <td><button class="button_2" onclick="removeProductFromCart('${item.productId}')">Remove</button></td>
        </tr>
        `;
    });
    carttablebody.innerHTML = output;


    // let me = document.getElementById(`quantity-${productId}`).value;
    // console.log(me)
}

const removeProductFromCart = (productId) => {
    let cartItems = JSON.parse(localStorage.getItem('products'));
    cartItems.map((item, i) => {
        console.log(i)
        console.log(item)

        if (item.productId === productId) { console.log('entered')
            cartItems.splice(i, 1);
            // delete cartItems[i];
            console.log(cartItems);
        }
    })
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