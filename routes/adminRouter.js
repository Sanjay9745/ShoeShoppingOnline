const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModels");
const validateCredentials = require("../validate/validation");
const adminCheck = require("../middleware/AdminCheck");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");
const User = require("../models/userModel");
const { sendMail } = require("./userAction");

router.post("/register", adminCheck, async (req, res) => {
  const { name, email, password } = req.body;
  const validation = validateCredentials(email, password);
  if (validation) {
    try {
      const existingAdmin = await Admin.findOne({ email: email });

      if (existingAdmin) {
        return res.status(409).json({ message: "Admin already exists" });
      } else {
        bcrypt.hash(password, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return;
          }
          const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
          });

          let token = jwt.sign(
            {
              id: newAdmin._id,
              name: newAdmin.name,
            },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: "1h" }
          );

          res.status(201).json({ auth: true, token: token });
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid Email or Password" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = validateCredentials(email, password);
  if (!validation) {
    res.status(400).json({ message: "Email or password invalid" });
  }
  try {
    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin) {
      bcrypt.compare(password, existingAdmin.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return;
        }

        if (result) {
          let token = jwt.sign(
            {
              id: existingAdmin._id,
              name: existingAdmin.name,
            },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: "1h" }
          );
          res.status(201).json({ auth: true, token: token });
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      });
    } else {
      return res.status(409).json({ message: "Admin doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/protected", adminCheck, (req, res) => {
  res.status(200).json({ auth: true });
});

router.post("/add-product",adminCheck, async (req, res) => {
  const file = req.files?.file;
  const file2 = req.files?.file2;
  const file3 = req.files?.file3;
  const { name, price, stock, desc } = req.body;

  try {
    const img = await cloudinary.uploader.upload(file.tempFilePath);
    const img2 = await cloudinary.uploader.upload(file2.tempFilePath);
    const img3 = await cloudinary.uploader.upload(file3.tempFilePath);

    const newProduct = new Product({
      name,
      price,
      stock,
      img: img.url,
      img2: img2.url,
      img3: img3.url,
      desc,
    });

    const savedProduct = await newProduct.save();

    res.status(200).json({
      message: "Product created",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/demo-add", (req, res) => {
  const newProduct = new Product({
    name: "hello",
    price: 20,
    img: "http://res.cloudinary.com/dslu5n3wq/image/upload/v1685720694/pvijpfnx5...",
    img2: "http://res.cloudinary.com/dslu5n3wq/image/upload/v1685720696/xl0gpacdc...",
    img3: "http://res.cloudinary.com/dslu5n3wq/image/upload/v1685720698/sckzykokc...",
    stock: 20,
    rating: 0,
    desc: "hello",
  });

  newProduct
    .save()
    .then(() => {
    
      res.json({ message: "success" });
    })
    .catch((error) => {
      console.error("Error saving product:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.patch("/edit-product", adminCheck, (req, res) => {
  const { id, name, price, stock, desc, img, img2, img3 } = req.body;

  // Here, you can perform the necessary validations and sanitization on the input data.

  Product.findByIdAndUpdate(
    id,
    { name, price, stock, desc, img, img2, img3 },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res
        .status(200)
        .json({
          message: "Product updated successfully",
          product: updatedProduct,
        });
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the product" });
    });
});

router.delete("/remove-product/:id", adminCheck, (req, res) => {
  const id = req.params.id;

  Product.findByIdAndRemove(id)
    .then((removedProduct) => {
      if (!removedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product removed successfully" });
    })
    .catch((error) => {
      console.error("Error removing product:", error);
      res
        .status(500)
        .json({ error: "An error occurred while removing the product" });
    });
});

router.get("/users", adminCheck, (req, res) => {
  User.find({})
    .select("_id name email orders") // Select specific fields to retrieve
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving users" });
    });
});

router.delete("/user/:id", adminCheck, (req, res) => {
  const id = req.params.id;

  User.findOneAndRemove(id)
    .then(() => {
      res.status(200).json({ message: "User deleted" });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    });
});

router.get("/order/:id", adminCheck, (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id }) // Assuming you want to find the order for the logged-in user
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const order = user.orders;
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/order", adminCheck, (req, res) => {
  const { id, status, orderId, deliveryNumber } = req.body;

  User.findOneAndUpdate(
    { _id: id, "orders._id": orderId }, // Find the user and the specific order by its ID
    { $set: { "orders.$.status": status, "orders.$.deliveryNumber": deliveryNumber } }, // Update the status and deliveryNumber fields of the found order
    { new: true } // Return the updated document
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(user.email);
      res.status(200).json({ message: "Order status updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});
module.exports = router;
