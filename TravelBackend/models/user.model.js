import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)// here userSchema =is the name of models 

export default User
  // user.model {file name}== this will contain a structure for mongodb 
  // ye file mongo db me data save kis formate me hoga is kam ati h 

  // why we use {timestamps:true} 
  //ans//{
  //"_id": "65a12f...",
  //"email": "user@test.com",
  //"createdAt": "2026-01-10T08:12:30.000Z",
  //"updatedAt": "2026-01-15T06:40:11.000Z"
//}this will add two setup which is important


// Q2- why we use "User" inside a mongoose.model("User",userSchema)
// Ans- here "User" is define a name jo ki database me jake smaller cse in pural form me change ho jayega 
// "User"= become "users"  it is a collection name 
// Database: myApp
// Collection: users
