export default
{
  "swagger" : "2.0",
	"info" : {
		"version": "1.0.0",
		"title": "Store Manager",
		"description": "A web application that helps store owners manage sales and product inventory records. Store owners/managers can create store attendant accounts who would be in charge of selling of items in the store.",
		"contact": {
			"email": "ekunolaeasybuoy@gmail.com"
		},
		"license": {
			"name": "ISC",
			"url": "https://opensource.org/licenses/ISC"
		}
	},
	"host": "https://store--manager.herokuapp.com",
	"basePath": "/api/v1/",
	"tags": [
		{
			"name": "Users",
			"description": "API for users in the system"
		},
		{
			"name": "Products",
			"description": "API for products on the platform"
		},
		{
			"name": "Sales",
			"description": "API for sales on the platform"
		},
		{
			"name": "Categories",
			"description": "API for categories on the platform"
		}
	],
	"schemes": [
		"https",
		"http"
	],
	"consumes": [
		"application/json"
	],
	"produces": [
		"application/json"
	],
	"paths": {
		"/auth/signup": {
			"post": {
				"summary": "Creates a new user",
				"tags": [
					"Users"
				],
				"description": "This route is used by the admin to create a new user on the platform",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
					{
						"name": "user",
						"in": "body",
						"description": "Details of user to be created",
						"required": true,
						"schema": {
							"$ref": "#/definitions/signup"
						}
					}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "User Created Successfully"
					}
				}
			}
		},
		"/auth/users" : {
            "get": {
				"tags": [
					"Users"
				],
                "summary": "Get all Users",
                "description": "This can only be done by the logged in admin.",
                "parameters": [
					{
						"in": "header",
						"name": "Authorization",
						"description": "Enter token",
						"type": "string",
						"required": true
                    }
                ],
				"responses": {
					"200": {
						"description": "Success",
						"schema": {
							"$ref": "#/definitions/FoundUsers"
						}
					}
				}
			}
		},
		"/auth/{userId}" : {
			"get": {
				"tags": [
					"Users"
				],
                "summary": "Get a user with given ID",
                "description": "This can only be done by the logged in user.",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
					{
						"name": "userId",
						"in": "path",
						"description": "The id of the user to be found",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "success",
						"schema": {
							"$ref": "#/definitions/FoundUsers"
						}
					},
					"404": {
						"description": "No user found"
					}
				}
			},
			"put": {
				"summary": "Update a user by ID",
				"tags": [
					"Users"
				],
				"description": "Update a user in the platform by the admin",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
						{
							"name": "user",
							"in": "body",
							"description": "The user that we want to update",
							"required": true,
							"schema": {
								"$ref": "#/definitions/UserCreate"
							}
						},
						{
							"name": "userId",
							"in": "path",
							"description": "The id of the user to be updated",
							"required": "true",
							"type": "integer",
							"format": "int64"
						}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "User updated successfully"
					},
					"404": {
						"description": "User does not exist"
					}
				}
			},
			"delete": {
				"tags": [
					"Users"
				],
                "summary": "Deletes a user with given ID",
                "description": "This can only be done by admin.",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
					{
						"name": "userId",
						"in": "path",
						"description": "The id of the user to be deleted",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "successfully deleted user"
					},
					"404": {
						"description": "User does not exist"
					}
				}
			}
		},
		"/auth/login": {
			"post": {
				"summary": "User login",
				"tags": [
					"Users"
				],
				"description": "Login a user",
				"parameters": [
					{
						"name": "user",
						"in": "body",
						"description": "A user that wants to login",
						"required": true,
						"schema": {
							"$ref": "#/definitions/login"
						}
					}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"200": {
						"description": "Success"
                    },
                    "404": {
						"description": "User not found"
                    },
                    "401": {
						"description": "Invalid Credentials"
					}
                    
				}
			}
		},
		"/products": {
			"post": {
				"summary": "Add a product",
				"tags": [
					"Products"
				],
				"description": "Admin create a new product",
				"parameters": [
					{
						"in": "header",
						"name": "Authorization",
						"description": "Enter token",
						"type": "string",
						"required": true
					},
					{
						"name": "product",
						"in": "body",
						"description": "A new product to be added to the system",
						"required": true,
						"schema": {
							"$ref": "#/definitions/ProductCreate"
						}
					}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "Successfully added product(s)"
					}
				}
			},
            "get": {
				"tags": [
					"Products"
				],
                "summary": "Get all Products",
                "description": "This can only be done by the logged in user.",
                "parameters": [
					{
						"in": "header",
						"name": "Authorization",
						"description": "Enter token",
						"type": "string",
						"required": true
                    }
                ],
				"responses": {
					"200": {
						"description": "Success",
						"schema": {
							"$ref": "#/definitions/FoundProducts"
						}
					}
				}
			}
		},
		"/products/{productId}": {
			"get": {
				"tags": [
					"Products"
				],
                "summary": "Get a product with given ID",
                "description": "This can only be done by the logged in user.",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
					{
						"name": "productId",
						"in": "path",
						"description": "The id of the product to be found",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "Success",
						"schema": {
							"$ref": "#/definitions/FoundProducts"
						}
					},
					"401": {
						"description": "Invalid ID supplied"
					}
				}
			},
			"put": {
				"summary": "Update a product by ID",
				"tags": [
					"Products"
				],
				"description": "Update a product in the platform by the admin",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
						{
							"name": "product",
							"in": "body",
							"description": "The product that we want to update",
							"required": true,
							"schema": {
								"$ref": "#/definitions/ProductCreate"
							}
						},
						{
							"name": "productId",
							"in": "path",
							"description": "The id of the product to be updtated",
							"required": "true",
							"type": "integer",
							"format": "int64"
						}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "Product updated successfully"
					},
					"404": {
						"description": "Product does not exist"
					}
				}
			},
			"delete": {
				"tags": [
					"Products"
				],
                "summary": "Deletes a product with given ID",
                "description": "This can only be done by admin.",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
					{
						"name": "productId",
						"in": "path",
						"description": "The id of the product to be deleted",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "successfully deleted product"
					},
					"404": {
						"description": "Product does not exist"
					}
				}
			}

		},
		"/products/{productId}/category": {
			"put": {
				"summary": "Update a product category by ID",
				"tags": [
					"Products"
				],
				"description": "Update a product in the platform by the authenticated user",
				"parameters": [
                        {
                            "in": "header",
                            "name": "Authorization",
                            "description": "Enter token",
                            "type": "string",
                            "required": true
                        },
						{
							"name": "product",
							"in": "body",
							"description": "The product that we want to update",
							"required": true
						},
						{
							"name": "productId",
							"in": "path",
							"description": "The id of the product to be updtated its category",
							"required": "true",
							"type": "integer",
							"format": "int64"
						}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "Product category updated successfully"
					},
					"404": {
						"description": "Product does not exist"
					}
				}
			}
		},

		"/sales/{userId}/sales" : {
            "get": {
				"tags": [
					"Sales"
				],
                "summary": "Get Sales that belongs to a given user ID",
                "description":"This can be done by the admin and sale owner",
				"parameters": [
                    {
                        "in": "header",
                        "name": "Authorization",
                        "description": "Enter token",
                        "type": "string",
                        "required": true
                    },
					{
						"name": "userId",
						"in": "path",
						"description": "The id of the user whose sales are to be found",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "success",
						"schema": {
							"$ref": "#/definitions/FoundSales"
						}
					},
					"401": {
						"description": "Invalid ID supplied"
					}
				}
			}
		},

		"/sales": {
			"post": {
				"summary": "Add an sales for a system",
				"tags": [
					"Sales"
				],
				"description": "Only logged in attendant can do this",
				"parameters": [
					{
						"in": "header",
						"name": "Authorization",
						"description": "Enter token",
						"type": "string",
						"required": true
					},
					{
						"name": "sales",
						"in": "body",
						"description": "Add a new sale order",
						"schema": {
							"$ref": "#/definitions/SalesCreate"
						}
					}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"201": {
						"description": "Sales sucessfully created"
					}
				}
            },
            "get": {
				"summary": "get all sales from the system",
				"tags": [
					"Sales"
				],
				"description": "Only logged in admin can do this",
				"parameters": [
                    {
                        "in": "header",
                        "name": "Authorization",
                        "description": "Enter token",
                        "type": "string",
                        "required": true
                    },
					{
						"in": "header",
						"name": "Authorization",
						"description": "Enter token",
						"type": "string",
						"required": true
					}
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"200": {
                        "description": "Success",
                        "schema": {
							"$ref": "#/definitions/foundSales"
						}
					}
				}
			}
			
		},
		"/sales/{saleId}": {
			"get": {
				"tags": [
					"Sales"
				],
                "summary": "Get a sale with ID",
                "description": "this can be done by only logged in admin and sale owner",
				"parameters": [
                    {
                        "in": "header",
                        "name": "Authorization",
                        "description": "Enter token",
                        "type": "string",
                        "required": true
                    },
					{
						"name": "saleId",
						"in": "path",
						"description": "The id of the sale to get ",
						"required": "true",
						"type": "integer",
						"format": "int64"
					}
				],
				"responses": {
					"200": {
						"description": "Success",
						"schema": {
							"$ref": "#/definitions/FoundSales"
						}
					},
					"400": {
						"description": "Invalid ID supplied"
                    },
                    "404": {
						"description": "Sale not found"
					}
				}
			}
		}
		
	},

	"definitions": {
		"signup": {
			"type": "object",
			"required": [
                "name",
				"email",
                "password",
                "type"
			],
			"properties": {
				"name": {
					"type": "string"
                },
				"email": {
					"type": "string"
				},
				"password": {
					"type": "string"
                },
                "type": {
					"type": "string"
				}
			}
		},
		"login": {
			"type": "object",
			"required": [
				"email",
				"password"
			],
			"properties": {
				"username": {
					"type": "string",
					"uniqueItems": true
				},
				"password": {
					"type": "string"
				}
			}
		},
		"ProductCreate": {
			"type": "object",
			"required": [
                "productName",
                "desciption",
                "image",
                "prize",
                "quantity",
                "min"
			],
			"properties": {
				"productName": {
					"type": "string"
				},
				"description": {
					"type": "string"
                },
                "image": {
					"type": "string"
                },
                "prize": {
					"type": "integer"
                },
                "quantity": {
					"type": "integer"
                },
                "min": {
					"type": "integer"
				}
			}
		},
		"FoundUsers": {
			"type": "object",
			"required": [
				"users"
			],
			"properties": {
				"users": {
					"type": "object"
				}
			}
		},
		"FoundProducts": {
			"type": "object",
			"required": [
				"products"
			],
			"properties": {
				"products": {
					"type": "object"
				}
			}
		},
		"FoundSales": {
			"type": "object",
			"required": [
				"sales"
			],
			"properties": {
				"sales": {
					"type": "object"
				}
			}
		},
		"SalesCreate": {
			"type": "object",
			"required": [
                "sellerId",
                "productId",
                "productName",
                "prize",
                "quantity"
			],
			"properties": {
				"sellerId": {
					"type": "integer"
                },
                "productId": {
					"type": "integer"
                },
                "productName": {
					"type": "string"
                },
                "prize": {
					"type": "integer"
                },
                "quantity": {
					"type": "integer"
                }
			}
		}
	}
}