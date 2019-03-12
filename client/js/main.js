'use strict';

const openSlideMenu = () => {
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('main').style.marginLeft = '250px';
};


const closeSlideMenu = () =>{
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
};


// Set user icon image
document.getElementById('userimg').src = this.userImage;

// Set dashboard url
document.getElementById('appnamehref').href = this.dashboard_url;