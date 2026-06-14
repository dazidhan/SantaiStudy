require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import Config Swagger
const { swaggerUi, specs } = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pemasangan Swagger UI di endpoint /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/santaistudy';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SantaiStudy API! Buka /api-docs untuk melihat dokumentasi.' });
});

// Import & Register Routes
const taskRoutes = require('./routes/taskRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const moodRoutes = require('./routes/moodRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/moods', moodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📄 API Documentation tersedia di: http://localhost:${PORT}/api-docs`);
});
