
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let users = {}; // In-memory user store

exports.signup = async (req, res) => {
  const { username, password, age } = req.body;
  if (!username || !password || !age) return res.status(400).json({ error: 'Missing fields' });

  if (users[username]) return res.status(409).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = age < 18 ? 'minor' : 'adult';

  users[username] = { username, password: hashedPassword, age, role, bio: '', avatar: '' };

  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ username, role: user.role }, 'supersecret', { expiresIn: '2h' });
  res.json({ token });
};

exports.getProfile = (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { username, age, bio, avatar, role } = user;
  res.json({ username, age, bio, avatar, role });
};

exports.updateProfile = (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { bio, avatar } = req.body;
  if (bio) user.bio = bio;
  if (avatar) user.avatar = avatar;

  res.json({ message: 'Profile updated' });
};
