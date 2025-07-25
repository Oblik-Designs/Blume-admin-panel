import React from "react";
import { Result, Button } from "antd";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="500"
                    title="Something went wrong"
                    subTitle="Please refresh the page or contact support if the problem persists."
                    extra={
                        <Button
                            type="primary"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
