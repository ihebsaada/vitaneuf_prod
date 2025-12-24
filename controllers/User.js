import User from '../models/User.js';
import jwt from 'jsonwebtoken';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // adjust expiration if needed
    );

    // Return token + user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, phone, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude passwords
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  };
  
  // 📄 GET USER BY ID
  export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
  };
  
  // ✏️ UPDATE USER
  export const updateUser = async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;
  
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Only update if field is provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (role) user.role = role;
      if (password) user.password = password; // will be hashed by pre-save hook
  
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  };
  
  // ❌ DELETE USER
  export const deleteUser = async (req, res) => {
    try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Delete failed', error: err.message });
    }
  };