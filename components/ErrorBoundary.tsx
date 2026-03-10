import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235] flex items-center justify-center px-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-white/80 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 bg-black/20 rounded-lg p-4">
                <summary className="text-white/70 cursor-pointer mb-2">Error details</summary>
                <pre className="text-xs text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#2A2A5B] to-[#121235] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#2A2A5B]/50 transition-all duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
