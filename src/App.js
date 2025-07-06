import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import { ApiProvider } from "./contexts/ApiContext";
import { AppProvider } from "./contexts/AppContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { router } from "./routes";
import "./styles/globals.css";

// Blume theme configuration
const theme = {
    token: {
        colorPrimary: "#722ed1", // Blume purple
        colorSuccess: "#52c41a",
        colorWarning: "#faad14",
        colorError: "#ff4d4f",
        borderRadius: 8,
        borderRadiusLG: 12,
    },
    components: {
        Layout: {
            siderBg: "#001529",
            headerBg: "#fff",
        },
        Menu: {
            darkItemBg: "#001529",
            darkItemSelectedBg: "#722ed1",
        },
    },
};
function App() {
    return (
        <ConfigProvider theme={theme}>
            <AuthProvider>
                <ApiProvider>
                    <AppProvider>
                        <ErrorBoundary>
                            <RouterProvider router={router} />
                        </ErrorBoundary>
                    </AppProvider>
                </ApiProvider>
            </AuthProvider>
        </ConfigProvider>
    );
}
export default App;
