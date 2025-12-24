const User = require('../Models/users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const checkExistingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// LOGIN (next step)
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token (optional, depending on your auth strategy)
    const token = jwt.sign(
      {
       userId: user._id,
       username: user.username, 
       role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
};

const changePassword =async(req,res)=>{
  try{
    const userId = req.userInfo.userId;
     //exract old and new password

     const {oldPassword,newPassword} =req.body;

     //find the current logged in use
     const user =await User.findById(userId);
     if(!user){
      return res.status(400).json({
        success :false,
        message: 'user not found'
      });
     }
     //if the old password is correct
     const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
     if(!isPasswordMatch){
      return res.status(400).json({
        success: false,
        message:'old password is not correct! please try again'
      });
     }
     //hash the new password
     const salt = await bcrypt.genSalt(10);
     const newHashedPassowrd = await bcrypt.hash(newPassword,salt);

    //update user password
    user.password = newHashedPassowrd
    await user.save();

    res.status(200).json({
      succes:true,
      message:"Password changed successfully"
    });

  }catch(error){
    console.log(Error);
    res.status(500).json({
      succes: false,
      message:"eeror occured ! try again"
    });
  }
}

module.exports = { registerUser, loginUser,changePassword};
