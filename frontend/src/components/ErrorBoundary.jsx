import React from 'react';
import logger from "../utils/logflare";
import { Button } from "@mui/material";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logger.error(new Error("Render error"), error.toString());
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <Button onClick={() => window.location.reload()} variant="outlined" color="warning" size="medium">Refresh</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
