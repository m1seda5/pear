import React from "react";

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Store errorInfo in state so we can display it
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          margin: '20px', 
          padding: '20px', 
          border: '1px solid red',
          borderRadius: '5px',
          backgroundColor: '#fff8f8' 
        }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Error details</summary>
            <p>{this.state.error?.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}