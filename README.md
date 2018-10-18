[![Build Status](https://travis-ci.org/Easybuoy/storemanager.svg?branch=develop)](https://travis-ci.org/Easybuoy/storemanager)
[![Coverage Status](https://coveralls.io/repos/github/Easybuoy/storemanager/badge.svg?branch=develop)](https://coveralls.io/github/Easybuoy/storemanager?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/969d38484786692dd8c5/maintainability)](https://codeclimate.com/github/Easybuoy/storemanager/maintainability)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

# Store Manager
A web application that helps store owners manage sales and product inventory records..
 
 <h2>Link To Pivotal Tracker: <a href="https://www.pivotaltracker.com/n/projects/2203192">Pivotal Tracker</a> </h2>

<br>
<h1>Store Manager UI Template</h1>

<h2>Built With</h2>
<ul>
<li><a href="https://developer.mozilla.org/kab/docs/Web/HTML">HTML</a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS">CSS</a></li>
<li><a href="https://developer.mozilla.org/bm/docs/Web/JavaScript">JAVASCRIPT</a></li>
</ul>


<h3>Link to template: <a href="https://easybuoy.github.io/storemanager/UI/login.html">Store Manager Template</a> </h3>
<hr>

<h1>Store Manager API Backend</h1>

<h2>Built With</h2>
<ul>
<li><a href="https://nodejs.org/en/">Nodejs</a></li>
<li><a href="https://expressjs.com/">Expressjs</a></li>
<li><a href="https://www.npmjs.com/package/body-parser">Body Parser</a></li>
<li><a href="https://www.npmjs.com/package/jsonwebtoken">Json Web Token</a></li>
<li><a href="http://passportjs.org">Passportjs</a></li>
<li><a href="https://www.npmjs.com/package/multer">Multer</a></li>
<li><a href="https://www.npmjs.com/package/cors">Cors</a></li>
<li><a href="https://www.npmjs.com/package/morgan">Morgan</a></li>
<li><a href="https://babeljs.io/">Babel</a></li>
<li><a href="https://eslint.org/">Eslint (Airbnb Style Guide)</a></li>
</ul>

<h2>Testing Tools </h2>
<ul>
<li><a href="https://mochajs.org/">Mocha</a></li>
<li><a href="https://www.chaijs.com/">Chai</a></li>
<li><a href="https://www.npmjs.com/package/nyc">Nyc (Reporting Tool)</a></li>
</ul>

<h3>Link to API: <a href="https://store--manager.herokuapp.com/">Store Manager API</a> </h3>

<h2>Getting Started</h2>
<h3>Prerequisites</h3>
You need Nodejs Installed to be able to run this project on your machine.

<h3>Installing<h3>
<ul><li>Clone Repository</li></ul>
<code>git clone https://github.com/Easybuoy/storemanager</code>
<br>
<br>

<ul><li>Change Directory To Store Manager</li></ul>
<code>cd storemanager</code>
<br>
<br>

<ul><li>Install Dependencies</li></ul>
<code>npm install</code>
<br>
<br>

<ul><li>Start Application</li></ul>
<code>npm run start</code>
<br>
<br>

<ul><li>Run Test</li></ul>
<code>npm run test</code>
<br>
<br>

<ul><li>Run Coverage Report</li></ul>
<br>
<code>npm run coveralls</code>
<br>
<br>

<h2>API Routes</h2> <br>
Register User => <code>POST || /api/v1/users/register</code> <br><br>
Login User => <code>POST || /api/v1/users/login</code> <br><br>
Get Current User Details => <code>GET || /api/v1/users/current</code> <br><br>
Create New Product => <code>POST || /api/v1/products</code> <br><br>
Get Products Details => <code>GET || /api/v1/products</code> <br><br>
Get Single Product Detail => <code>GET || /api/v1/products/{productId}</code> <br><br>
Create New Sale Record => <code>POST || /api/v1/sales</code> <br><br>
Get Sale Records => <code>GET || /api/v1/sales</code> <br><br>
Get Single Sale Record => <code>GET || /api/v1/sales/{salesId}</code> <br><br>








<h2>License</h2>
<h4>This project makes use of the MIT License which can be found <a href="https://github.com/Easybuoy/storemanager/blob/develop/LICENSE">here</a></h4>