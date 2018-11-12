const addToCart = (productId, productImage, productPrice) => {
    const products = {
        productId,
        productImage,
        productPrice
    };
    const totalcartitems = JSON.parse(localStorage.getItem('products'));
    console.log(totalcartitems)
  // If nothing is in cart add new item
  if (totalcartitems === null) {
    const data = [];

    data.push(products);
    localStorage.setItem('products', JSON.stringify(data));
  }
  // Else push to what is existing in cart.
  totalcartitems.push(products);
  localStorage.setItem('products', JSON.stringify(totalcartitems));

    
    
    
    // let me = document.getElementById(`quantity-${productId}`).value;
    // console.log(me)
    

      
    showCartCount();
    // let existingCartItem = localStorage.getItem('products');
};

const showCart = () => {
    
}

// This function appends the total item in cart to the cart image on the frontend
const showCartCount = () => {
  const totalcartitem = JSON.parse(localStorage.getItem('products'));
  document.getElementById('shoppingcartlabel').innerHTML = totalcartitem.length;
};

showCartCount();