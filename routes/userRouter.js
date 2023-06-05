const express = require("express");

const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validateCredentials = require("../validate/validation");
const authenticateToken = require("../middleware/jwt"); //middleware to check if the user is authenticated or not. (Only for JWT)
const checkLogin = require("../middleware/checkLogin");
const Product = require("../models/productModel");
const { sendMail } = require("./userAction");
const { generateOTP } = require("./userAction");
//Sign Up
router.post("/register", async (req, res) => {
  const { name, email, password, cartItems } = req.body;
  const validation = validateCredentials(email, password);

  if (validation) {
    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      } else {
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Error hashing password" });
          }

          try {
            const newUser = new User({
              name,
              email,
              password: hashedPassword,
              cartItems,
            });

            const savedUser = await newUser.save();

            const token = jwt.sign(
              {
                id: savedUser._id,
                name: savedUser.name,
              },
              process.env.JWT_USER_SECRET,
              { expiresIn: "1h" }
            );

            res.status(200).json({ auth: true, token: token });
          } catch (error) {
            console.error("Error saving user with cart items:", error);
            res.status(500).json({ message: "Error saving user" });
          }
        });
      }
    } catch (error) {
      console.error("Error finding existing user:", error);
      res.status(500).json({ message: "Error finding existing user" });
    }
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = validateCredentials(email, password);
  if (!validation) {
    res.status(400).json({ message: "Email or password invalid" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      bcrypt.compare(password, existingUser.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return;
        }

        if (result) {
          let token = jwt.sign(
            {
              id: existingUser._id,
              name: existingUser.name,
            },
            process.env.JWT_USER_SECRET,
            { expiresIn: "1h" }
          );
          res.status(200).json({ auth: true, token: token });
        } else {
          res.status(401).json({ message: "incorrect password" });
        }
      });
    } else {
      return res.status(409).json({ message: "User doesn't exist" });
    }
    // Send a response with the newly created user
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//validate User
router.get("/protected", checkLogin, (req, res) => {
  try {
    res.status(200).json({ user: req.user,userId:req.user.id });
  } catch (e) {
    res.status(401).json({ error: e ,userId:req.user.id});
  }
});

//Get Products
router.get("/products", (req, res) => {
  Product.find({})
    .then((result) => {
      res.json(result); //returns all products in the database.  (not paginated)  (useful for debugging)
    })
    .catch((e) => res.json({ error: e }));
}); // empty page for now.  Add a page for a user to sign up if needed.

router.get("/products/:id", (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(result);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.post("/set-rating", checkLogin, (req, res) => {
  const { productId, rating } = req.body;

  User.findById(req.user.id)
    .then((user) => {
      let existingProductIndex = user.ratedProducts.findIndex(
        (item) => item.productId == productId
      );
      if (existingProductIndex === -1) {
        user.ratedProducts.push({ productId, rating });
        user.save().then(() => {
          Product.findById(productId).then((product) => {
            const sumOfRatings = product.rating * product.numberOfRating + rating;
            product.numberOfRating += 1;
            if (product.numberOfRating !== 0) {
              const averageRating = sumOfRatings / product.numberOfRating;
              let newRating = averageRating.toFixed(2);
              product.rating = newRating;
            }
            product.save().then(() => {
              res.status(200).json({ message: "Rating set successfully" });
            }).catch((error) => {
              res.status(400).json({ error: error });
            });
          }).catch((error) => {
            res.status(400).json({ error: error });
          });
        }).catch((error) => {
          res.status(400).json({ error: error });
        });
      } else {
        res.status(400).json({ message: "Rating already exists for this product" });
      }
    }).catch((error) => {
      res.status(400).json({ error: error });
    });
});
router.get("/already-rated/:id", checkLogin, (req, res) => {
  const {id} = req.params;

  User.findById(req.user.id)
    .then((user) => {
      let existingProductIndex = user.ratedProducts.findIndex(
        (item) => item.productId == productId
      );
      if (existingProductIndex === -1) {
        res.status(200).json(true);
      } else {
        res.status(201).json(false);
      }
    }).catch((error) => {
      res.status(400).json({ error: error });
    });
});




// Delete a user
router.delete("/user", checkLogin, (req, res) => {
  User.findByIdAndRemove(req.user.id)
    .then((user) => {
      if (user) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

//update user
router.patch("/user", checkLogin, (req, res) => {
  const { name, password } = req.body;

  
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }

    try {
      if(name){
      }else{
        User.findByIdAndUpdate(
          req.user.id,
          {password: hashedPassword },
          { new: true }
        ).then((result) => {
          res.status(200).json({ message: "Updated", result: result });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "An error occurred while updating the user" });
        });
      }    
    } catch (error) {
      console.error("Error saving user with cart items:", error);
      res.status(500).json({ message: "Error saving user" });
    }
  });
});
// forgot password
router.get("/user-exist/:email", (req, res) => {
  const email = req.params.email;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.status(200).json({ id: user._id }); // Corrected: use user._id instead of user_id
      } else {
        res.status(404).json({ message: "User not found" }); // Corrected: use lowercase "user" and update error message
      }
    })
    .catch((error) => {
      console.error(error); // Add error handling for database queries
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/user/send-otp",async (req, res) => {
  const id = req.body.id
  const otp = generateOTP(6);
  try {
   
    // Update the user document in the database with the generated OTP
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { otp },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    sendMail(
      updatedUser.email,
      "OTP Verification",
      `Your One Time Password is ${updatedUser.otp}`,
      `Your One Time Password is ${updatedUser.otp}`
    )
      .then(() => {
        res
          .status(200)
          .json({ message: "OTP generated and sent for verification" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ error: "An error occurred while sending the email" });
      });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});

router.post("/user/otp-verify", (req, res) => {
  const { otp, id } = req.body;

  User.findOne({ _id: id })
    .then((user) => {
      if (user) {
        if (user.otp == parseInt(otp)) {
          user.verification = true; // Set the user to be verified.
          user.save()
            .then(() => {
              const token = jwt.sign(
                {
                  id: user._id,
                  name: user.name,
                },
                process.env.JWT_USER_SECRET,
                { expiresIn: "1h" }
              );
              res.status(200).json({ auth: true, token: token });
            })
            .catch((error) => {
              console.error(error); // Add error handling for saving user verification status
              res.status(500).json({ message: "Internal server error" });
            });
        } else {
          res.status(401).json({ message: "Invalid OTP" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.error(error); // Add error handling for database queries
      res.status(500).json({ message: "Internal server error" });
    });
});


//Cart Operation

//get cart item
router.get("/cart-items", checkLogin, (req, res) => {
  User.findById(req.user.id)
    .then(async (user) => {
      let items = user.cartItems.map(
        ({ productId, name, quantity, img, price }) => {
          return {
            id: productId,
            quantity,
            img,
            name,
            price,
          };
        }
      );
      res.status(200).json({ cartItems: items });
    })
    .catch((error) => res.status(401).json({ error }));
});

router.post("/add-cart", checkLogin, async (req, res) => {
  const { id, name, price, img } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      let existingProductIndex = user.cartItems.findIndex(
        (item) => item.productId == id
      );
      if (existingProductIndex !== -1) {
        const product = await Product.findById(id);
        if (
          product &&
          user.cartItems[existingProductIndex].quantity < product.stock
        ) {
          user.cartItems[existingProductIndex].quantity += 1;
          await user.save();
          res.status(200).json({ message: "Quantity updated in cart" });
        } else {
          res.status(400).json({ message: "Quantity exceeds available stock" });
        }
      } else {
        const product = await Product.findById(id);
        if (product && product.stock > 0) {
          user.cartItems.push({ productId: id, name, price, img, quantity: 1 });
          await user.save();
          res.status(200).json({ cartItems: user.cartItems });
        } else {
          res.status(400).json({ message: "Product is out of stock" });
        }
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/reduce-cart", checkLogin, async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      let existingProductIndex = user.cartItems.findIndex(
        (item) => item.productId == id
      );
      if (existingProductIndex !== -1) {
        if (user.cartItems[existingProductIndex].quantity > 0) {
          user.cartItems[existingProductIndex].quantity -= 1;
          await user.save();
          res.status(200).json({ message: "Quantity updated in cart" });
        } else {
          res.status(400).json({ message: "Quantity exceeds available stock" });
        }
      } else {
        res.status(404).json({ message: "product not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/remove-cart", checkLogin, async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user) {
      let existingProductIndex = user.cartItems.findIndex(
        (item) => item.productId == id
      );
      if (existingProductIndex !== -1) {
        user.cartItems.splice(existingProductIndex, 1);
        user
          .save()
          .then((result) => {
            res.status(200).json({ message: "Cart item deleted" });
          })
          .catch((e) => res.status(401).json({ error: e }));
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Verification

router.get("/user/is-verified", checkLogin, (req, res) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      if (user.verification) {
        res.status(200).json({ message: "User is Verified" });
      } else {
        res.status(401).json({ message: "User needs to be verified" });
      }
    })
    .catch((e) => res.status(401).json({ error: e }));
});

router.get("/user/verify", checkLogin, async (req, res) => {
  const otp = generateOTP(6); // Generate a 6-digit OTP
  try {
    // Update the user document in the database with the generated OTP
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { otp },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the OTP to the user's email for verification (implement your email sending logic here)
    sendMail(
      updatedUser.email,
      "OTP Verification",
      `Your One Time Password is ${otp}`,
      `Your One Time Password is ${otp}`
    )
      .then(() => {
        res
          .status(200)
          .json({ message: "OTP generated and sent for verification" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ error: "An error occurred while sending the email" });
      });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});

router.post("/user/otp", checkLogin, (req, res) => {
  const otp = req.body.otp; // Get the OTP from the client

  User.findOne({ _id: req.user.id, otp: otp })
    .then((user) => {
      if (user) {
        User.findByIdAndUpdate(
          req.user.id,
          { otp: null, verification: true },
          { new: true }
        )
          .then((result) => {
            res.status(200).json({ message: "OTP Verified" });
          })
          .catch((e) => res.status(401).json({ error: e }));
      } else {
        res.status(400).json({ error: "OTP not found" });
      }
    })
    .catch((e) => res.status(401).json({ error: e }));
});

//Shipping

router.post("/add-shipping", checkLogin, (req, res) => {
  const shippingAddress = req.body;
  if (
    !shippingAddress.recipientName ||
    !shippingAddress.streetAddress ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    return res.status(400).json({ message: "Missing shipping address data" });
  }
  User.findByIdAndUpdate(
    req.user.id,
    { $push: { shippingAddresses: shippingAddress } },
    { new: true }
  )
    .then((user) => {
      if (user) {
   
        res
          .status(200)
          .json({ message: "Shipping address added successfully" });
      } else {
       
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
   
      res.status(500).json({ message: "An error occurred" });
    });
});

router.get("/all-shipping", checkLogin, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user.shippingAddresses);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.delete("/remove-shipping/:id", checkLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (user) {
      const existingProductIndex = user.shippingAddresses.findIndex(
        (item) => item._id.toString() === id
      );
      if (existingProductIndex !== -1) {
        user.shippingAddresses.splice(existingProductIndex, 1);
        await user.save();
        res.json({ message: "Address Deleted" });
      } else {
        res.status(404).json({ message: "Shipping Address Not Found" });
      }
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/shipping/:id", checkLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const existingProductIndex = user.shippingAddresses.findIndex(
      (item) => item._id.toString() === id
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Shipping Address Not Found" });
    }
    res.status(200).json(user.shippingAddresses[existingProductIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/edit-shipping", checkLogin, async (req, res) => {
  try {
    const { id, updatedAddress } = req.body;
    const user = await User.findById({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const existingProductIndex = user.shippingAddresses.findIndex(
      (item) => item._id.toString() === id
    );
    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Shipping Address Not Found" });
    }
    user.shippingAddresses[existingProductIndex] = updatedAddress;
    await user.save();
    res.json({ message: "Address updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/order-now", checkLogin, (req, res) => {
  const {
    shippingId,
    recipientName,
    streetAddress,
    phoneNumber,
    city,
    country,
    apartmentNumber,
    state,
    postalCode,
  } = req.body;

  User.findById(req.user.id).then((user) => {
    const cartItems = user.cartItems;

    const order = cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      price:item.price,
      quantity: item.quantity,
    }));

    // Calculate the total price by summing the prices of all cart items
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const newOrder = {
      shippingId: shippingId,
      recipientName,
      streetAddress,
      phoneNumber,
      country,
      apartmentNumber,
      city,
      state,
      postalCode,
      items: order,
      totalPrice: totalPrice,
      orderDate: new Date(),
      status:"Ordered",
    };

    user.orders.push(newOrder);
    user.cartItems = [];

    user.save().then((result) => {
      res.status(200).json({ message: "Order Confirmed" });
      sendMail(
        result.email,
        "New Order",
        `Your Order Id is+${result.orders._id}`,
        "We Contact And Inform you about the delivery day"
      ); //send confirmation email to user.
    });
  });
});

router.get("/user/orders",checkLogin,(req,res)=>{
  User.findById(req.user.id).then((user)=>{
    res.status(200).json(user.orders);
  })
})
module.exports = router;
