import React from "react";

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div>Error in this section: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
} 