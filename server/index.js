require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(require('helmet')());
app.use(require('cors')({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], credentials: true }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const sessionStoreOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'traveloop'
};
const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(session({
  key: 'traveloop_sid',
  secret: process.env.SESSION_SECRET || 'traveloop_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/trips',      require('./routes/trips'));
app.use('/api/cities',     require('./routes/cities'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/budget',     require('./routes/budget'));
app.use('/api/checklist',  require('./routes/checklist'));
app.use('/api/notes',      require('./routes/notes'));
app.use('/api/transport',  require('./routes/transport'));
app.use('/api/share',      require('./routes/share'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/community',  require('./routes/community'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Traveloop server running at http://localhost:${PORT}`);
});
