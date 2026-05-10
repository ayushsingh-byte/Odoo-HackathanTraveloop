import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#faf9f6', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '0.5rem', color: '#c9a84c' }}>Something went wrong</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', maxWidth: 400 }}>We hit an unexpected error. Try refreshing the page.</p>
          <button onClick={() => window.location.reload()}
            style={{ padding: '0.75rem 2rem', borderRadius: 20, background: '#c9a84c', color: '#0a0a0a', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
