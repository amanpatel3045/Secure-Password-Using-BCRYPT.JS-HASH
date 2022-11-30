const express = require("express");

// backend ka router jo express provide kr rha hai

const router = express.Router();

require("../db/conn");
const User = require("../model/userSchema");

// router.get('/',(req,res)=>{
//     res.send(`You are on home page using router js in express`);
// });

//POST DATA USING async await
//Using async await is better than promises
//bcz it reduces lines of code and easy to understand

//register page pe jo bhi data enter kroge wo sb post ho jayega
router.post("/register", async (req, res) => {
  //getting all data using object destructuring
  const { name, email, phone, work, password, cpassword } = req.body;

  //FOR VALIDATION
  // agr koi bhi input filled empty rh gyi like name,email etc
  //to hm ek error show karenge user ko
  //error=> please fill all details.

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all details" });
  }
  try {
    //checking (stored email in db,user's filled email) user is registered or not
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword) {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password is not same" });
    } else {
      //else new user hai toh data ko get kro

      const user = new User({ name, email, phone, work, password, cpassword });
      // data get krne ke baad data ko hash kro for security purpose
      //before saving into database
      //it is not encryption=>isme decrypt kr skte hai but bcrypt me nhi
      //it is bcrypt=>isme decrypt nhi kr skte data ko

      //save method ko call krne se phle we will use pre
      //after save method we will use post
      //hashing wala code userSchema.js me hai

      // then user data ko Mongodb ke collection me save kr do
      await user.save();
      //after saving in collection
      //res.status 201 dekar message show kr do
      res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//LOGIN ROUTE
//POST DATA OF LOGIN CREDENTIALS

router.post("/signin", async (req, res) => {
  try {
    //user ne jo login input me jo fill kiya
    //wo hm get kr rhe hai using destructuring
    const { email, password } = req.body;
    //checking koi filled empty toh nhi hai
    if (!email || !password) {
      return res.status(400).json({ error: "please fill the data" });
    }
    //dono filled empty nhi hai
    //then database k data se login data ka match krenge
    //database ka data get krne k liye User collection ka use krenge
    //User ko already require kiya hai in above code
    //User.findOne({database ka email, email entered by user during login})
    //User.findOne will return promises

    const userLogin = await User.findOne({ email, email });
    console.log(userLogin);
    if (!userLogin) {
      res.status(400).json({ error: "invalid credential" });
    } else {
      res.json({ message: "signin successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
