const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//Document ka structure
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        //required:true => validation ki trh work karega means jb tk user name wali filled me 
        //kuchh type nhi karega tb tk wo nhi chalega error aa jayega
        required:true
    },
    email: {
        type: String,
        required:true
    },
    phone: {
        //type is number bcz phone no number type ka hota hai
        type:Number,
        required:true
    },
    work: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    cpassword: {
        type:String,
        required:true
    }
})

//userSchema ko project ke sath attach krne k liye models use karenge

//model create krna means collection create krna

//CREATING MODEL

//mongoose.model me jo USER hai wo mere collection ka name hoga
//collection bnne k baad Atlas me yeh plural ho jayega USER SE Users ho jayega
//userSchema ko collection k sath connect kr liya





//password n cpassword ko hash kr rhe hai bellow
//save se phle pre wala middleware chalega
//isiliye phle save likh hai
//save=>auth.js me define hai for saving data into database
userSchema.pre('save',async function(next){
    console.log("hi from inside");
    if(this.isModified('password')){
        console.log("hi i am pre");
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

const User = mongoose.model('USER',userSchema);

module.exports = User;
