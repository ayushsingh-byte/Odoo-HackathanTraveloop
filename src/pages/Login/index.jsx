import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [tab, setTab] = useState('login');
  const [alert, setAlert] = useState(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const [regFname, setRegFname] = useState('');
  const [regLname, setRegLname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regInfo, setRegInfo] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .catch(() => null)
      .then(data => {
        if (data && data.user) navigate('/my-trips');
      });
  }, []);

  const showAlertMsg = (msg, type = 'error') => {
    setAlert({ msg, type });
  };

  const clearAlert = () => setAlert(null);

  const switchTab = (t) => {
    setTab(t);
    clearAlert();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await API.post('/api/auth/login', { email: loginEmail, password: loginPassword });
    if (!data) return;
    if (data.error) return showAlertMsg(data.error);
    setUser(data.user);
    navigate('/my-trips');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = await API.post('/api/auth/register', {
      name: `${regFname} ${regLname}`.trim(),
      email: regEmail,
      password: regPassword,
      phone: regPhone || null,
      city_name: regCity || null,
      country_name: regCountry || null,
      additional_info: regInfo || null
    });
    if (!data) return;
    if (data.error) return showAlertMsg(data.error);
    setUser(data.user);
    navigate('/my-trips');
  };

  const bodyBg = tab === 'register'
    ? 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url(/bg_register.jpg) no-repeat center center / cover'
    : 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url(/bg_login.png) no-repeat center center / cover';

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      width: '100%',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      background: bodyBg,
      overflow: 'auto',
    }}>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .login-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 4%; }
        .login-logo { font-size: 20px; font-weight: 700; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
        .login-logo i { font-size: 22px; }
        .login-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 1rem 3rem; }
        .hero-text { text-align: center; margin-bottom: 28px; text-shadow: 0 4px 15px rgba(0,0,0,0.5); animation: fadeIn 1.2s ease-out; }
        .hero-text h1 { font-size: clamp(38px, 8vw, 88px); font-weight: 700; letter-spacing: clamp(8px, 2vw, 20px); line-height: 1; margin-bottom: 8px; }
        .hero-text p { font-size: 13px; font-weight: 500; letter-spacing: 3px; color: #e5e7eb; }
        .glass-card { width: 100%; max-width: 440px; padding: 36px 32px; border-radius: 20px; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(15,15,15,0.5); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: slideUp 0.7s ease-out forwards; }
        .glass-card.wide { max-width: 620px; }
        .auth-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.15); margin-bottom: 24px; }
        .auth-tabs button { flex: 1; padding: 10px; background: none; border: none; color: rgba(255,255,255,0.45); font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
        .auth-tabs button.active { color: white; border-bottom-color: white; }
        .form-subtitle { font-size: 13px; color: #d1d5db; font-weight: 300; margin-bottom: 22px; }
        .input-group { position: relative; margin-bottom: 16px; }
        .input-group i.icon-left { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 14px; }
        .input-group i.icon-right { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 14px; cursor: pointer; }
        .input-group i.icon-right:hover { color: white; }
        .login-input { width: 100%; padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); outline: none; background: rgba(0,0,0,0.2); color: white; font-family: 'Outfit', sans-serif; font-size: 14px; transition: all 0.3s; }
        .login-input::placeholder { color: #9ca3af; font-weight: 300; }
        .login-input:focus { border-color: rgba(255,255,255,0.5); background: rgba(0,0,0,0.3); }
        .login-input.has-icon-left { padding-left: 48px; }
        .login-input.has-icon-right { padding-right: 48px; }
        .login-textarea { width: 100%; padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); outline: none; background: rgba(0,0,0,0.2); color: white; font-family: 'Outfit', sans-serif; font-size: 14px; transition: all 0.3s; resize: vertical; min-height: 80px; }
        .login-textarea::placeholder { color: #9ca3af; font-weight: 300; }
        .login-textarea:focus { border-color: rgba(255,255,255,0.5); background: rgba(0,0,0,0.3); }
        .forgot { display: block; text-align: right; font-size: 12px; color: #d1d5db; text-decoration: none; margin-top: -8px; margin-bottom: 20px; transition: color 0.3s; }
        .forgot:hover { color: white; }
        .submit-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; background: #fdfdfd; color: #111827; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 4px; margin-bottom: 20px; transition: transform 0.2s, background 0.2s; }
        .submit-btn:hover { transform: translateY(-2px); background: white; }
        .submit-btn:active { transform: none; }
        .switch-link { font-size: 13px; color: #d1d5db; text-align: center; margin-top: 4px; }
        .switch-link a { color: white; font-weight: 600; text-decoration: none; cursor: pointer; }
        .switch-link a:hover { text-decoration: underline; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .photo-upload { width: 88px; height: 88px; border-radius: 50%; border: 2px dashed rgba(255,255,255,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin: 0 auto 22px; cursor: pointer; background: rgba(0,0,0,0.2); transition: all 0.3s; }
        .photo-upload:hover { background: rgba(0,0,0,0.4); border-color: white; }
        .photo-upload i { font-size: 22px; color: rgba(255,255,255,0.7); }
        .photo-upload span { font-size: 11px; color: rgba(255,255,255,0.6); }
        .alert-glass { padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; }
        .alert-glass.error { background: rgba(239,68,68,0.25); border: 1px solid rgba(239,68,68,0.4); }
        .alert-glass.success { background: rgba(34,197,94,0.25); border: 1px solid rgba(34,197,94,0.4); }
        @media (max-width: 600px) {
          .glass-card, .glass-card.wide { padding: 26px 18px; max-width: 95vw; }
          .form-grid { grid-template-columns: 1fr; }
          .hero-text { margin-bottom: 18px; }
        }
      `}</style>

      <header className="login-header">
        <div className="login-logo">
          <i className="fas fa-globe"></i> TRAVELOOP
        </div>
      </header>

      <main className="login-main">
        <div className="hero-text">
          <h1>TRAVELOOP</h1>
          <p>EXPLORE. EXPERIENCE. REMEMBER.</p>
        </div>

        <div className={`glass-card${tab === 'register' ? ' wide' : ''}`}>
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Login</button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>Register</button>
          </div>

          {alert && (
            <div className={`alert-glass ${alert.type}`}>{alert.msg}</div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <p className="form-subtitle">Login to continue your journey</p>
              <div className="input-group">
                <i className="icon-left far fa-envelope"></i>
                <input
                  type="email"
                  className="login-input has-icon-left"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="icon-left fas fa-lock"></i>
                <input
                  type={showLoginPwd ? 'text' : 'password'}
                  className="login-input has-icon-left has-icon-right"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
                <i
                  className={`icon-right far ${showLoginPwd ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowLoginPwd(!showLoginPwd)}
                ></i>
              </div>
              <a href="#" className="forgot">Forgot Password?</a>
              <button type="submit" className="submit-btn">Login</button>
              <p className="switch-link">Don't have an account? <a onClick={() => switchTab('register')}>Sign up</a></p>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="photo-upload">
                <i className="fas fa-camera"></i>
                <span>Photo</span>
              </div>
              <div className="form-grid" style={{ marginBottom: '14px' }}>
                <div className="input-group">
                  <input type="text" className="login-input" placeholder="First Name" value={regFname} onChange={e => setRegFname(e.target.value)} required />
                </div>
                <div className="input-group">
                  <input type="text" className="login-input" placeholder="Last Name" value={regLname} onChange={e => setRegLname(e.target.value)} required />
                </div>
                <div className="input-group">
                  <input type="email" className="login-input" placeholder="Email Address" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <input type="tel" className="login-input" placeholder="Phone Number" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                </div>
                <div className="input-group">
                  <input type="text" className="login-input" placeholder="City" value={regCity} onChange={e => setRegCity(e.target.value)} />
                </div>
                <div className="input-group">
                  <input type="text" className="login-input" placeholder="Country" value={regCountry} onChange={e => setRegCountry(e.target.value)} />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: '14px' }}>
                <textarea
                  className="login-textarea"
                  placeholder="Additional Information (optional)"
                  value={regInfo}
                  onChange={e => setRegInfo(e.target.value)}
                />
              </div>
              <div className="input-group" style={{ marginBottom: '20px' }}>
                <i className="icon-left fas fa-lock"></i>
                <input
                  type={showRegPwd ? 'text' : 'password'}
                  className="login-input has-icon-left has-icon-right"
                  placeholder="Password (min 6 chars)"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <i
                  className={`icon-right far ${showRegPwd ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowRegPwd(!showRegPwd)}
                ></i>
              </div>
              <button type="submit" className="submit-btn">Create Account</button>
              <p className="switch-link">Already have an account? <a onClick={() => switchTab('login')}>Log in</a></p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
