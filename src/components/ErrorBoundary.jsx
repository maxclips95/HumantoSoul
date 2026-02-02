import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 * Displays fallback UI instead of crashing the whole app
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: '#c41e3a', marginBottom: '20px' }}>🙏 Jai Gurudev</h1>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>Something went wrong</h2>
            <p style={{ color: '#666', marginBottom: '25px' }}>
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 30px',
                backgroundColor: '#c41e3a',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Refresh Page
            </button>

            {/* Show error details only in development */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details style={{ marginTop: '30px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#999' }}>
                  Error Details (Dev Only)
                </summary>
                <pre style={{
                  marginTop: '10px',
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px',
                  fontSize: '11px',
                  overflow: 'auto',
                  maxHeight: '150px'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
