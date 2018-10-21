'use strict';

const openSlideMenu = () => {
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('main').style.marginLeft = '250px';
};


const closeSlideMenu = () =>{
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
};

const addtocart = (nameofproduct, amountofproduct) => {
  const quantity = document.getElementById('number').value;
  let product = {};
  let data = [];

  let previouscartitem = JSON.parse(localStorage.getItem('product'));
 if (previouscartitem) {
    data = previouscartitem;
    amountofproduct = amountofproduct.replace('Price: ', '')
    product = {
      id: previouscartitem.id++,
      productname: nameofproduct,
      productquantity: quantity,
      productamount: amountofproduct
    };    
    data.push(product);
  } else {
    amountofproduct = amountofproduct.replace('Price: ', '');
    product = {
      id: 1,
      productname: nameofproduct,
      productquantity: quantity,
      productamount: amountofproduct
    };
    data.push(product);
  }

  localStorage.setItem('product', JSON.stringify(data));
  const totalcartitem = JSON.parse(localStorage.getItem('product'));
  document.getElementById('shoppingcartlabel').innerHTML = totalcartitem.length;
showCart(totalcartitem);
};

// This function shows cart in table format
const showCart = (data) => {
  if (data === undefined) {
    data = JSON.parse(localStorage.getItem('product'));
  }
  if (data == null || data == undefined) {
    let cartmodaldiv = document.getElementById('cartmodaldiv');
    cartmodaldiv.style.display = 'none';        
    cartmodaldiv.style.backgroundColor = 'white';
  } else {      
    let cartmodaldiv = document.getElementById('cartmodaldiv');
    cartmodaldiv.style.display = 'block';
    let carttablebody = document.getElementById('carttablebody');
    carttablebody.innerHTML = data.map((val) => {
      return `<tr><td>${val.productname}</td><td>${val.productamount}</td><td>${val.productquantity}</td></tr>`;
    }).join(''); 
  }
};

// THis function clears the cart and reloads the page
const clearCart = () => {
  localStorage.clear();
  return window.location.reload();
};

// Populate shopping cart
let totalcartitem = JSON.parse(localStorage.getItem('product'));
if (totalcartitem) {
  document.getElementById('shoppingcartlabel').innerHTML = totalcartitem.length;
}

showCart();

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal  
const btn = document.getElementById("shoppingcart");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
