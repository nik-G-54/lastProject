import bcryptjs from "bcryptjs"
import User from "../models/user.model.js" // here .js is important otherwise it shows an error  
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body  // this signup import  in the router.js and export all the values that are taken  
// during signup time 
  // Debug logging
  console.log("Signup request received")
  console.log("Request body:", req.body)
  console.log("Username:", username, "Type:", typeof username)
  console.log("Email:", email, "Type:", typeof email)
  console.log("Password:", password ? "***" : "undefined", "Type:", typeof password)

  // Validate fields exist and are not empty
  if (
    !username ||
    !email ||
    !password ||
    username.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    console.log("Validation failed - missing or empty fields")
    return next(errorHandler(400, "All fields are required"))
  }

  // check if the user already exists
  const existingUser = await User.findOne({ email }) // here User. is from mogoos db who check email exist or not 

  if (existingUser) {
    return next(errorHandler(409, "User already exist with this email!"))
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({  // here User is comming from User model.js 
    username,// or we write username:username because both name are same  
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()

    res.status(201).json({ /// here we write res.json itmeans we send this data to the client in the json formate 
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    console.error("Signup error:", error)
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return next(errorHandler(409, `${field} already exists`))
    }
    next(error)
  }
}

//.......................signin..........................................................................................

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  console.log("Signin request received")
  console.log("Email:", email)

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"))  // 
  }

  try {
    const validUser = await User.findOne({ email }) // this User.findOne({email:email}) check is email already register or not its a inbuild function if email exist then its data  will store in the valid user 

    if (!validUser) {
      return next(errorHandler(404, "User not found"))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password) // this will return true or false 

    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"))
    }
     
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET) // this is actually [jwt.sign(payload, secretKey, options?)] .. paylod = This data goes inside the token

    const { password: pass, ...rest } = validUser._doc // remove password before sending whole info to user {validUser._doc = actual MongoDB document}

    const isProd = process.env.NODE_ENV === 'production'

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true, // it means JavaScript CANNOT read this cookie  so no one could see the token only server could see 
        secure: isProd, // required by browsers for SameSite=None
        sameSite: isProd ? 'none' : 'lax', // allow cross-site cookie in prod
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      .json({
        success: true,
        message: "Signin successful",
        user: rest
      })
  } catch (error) {
    next(error)
  }
}
