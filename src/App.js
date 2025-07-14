// src/App.js (Updated with Authentication)
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import { ApiProvider } from "./contexts/ApiContext";
import { AppProvider } from "./contexts/AppContext";
import { router } from "./routes";
import "./styles/globals.css";

// Beens theme configuration
const theme = {
    token: {
        colorPrimary: "#722ed1", // Beens purple
        colorSuccess: "#52c41a",
        colorWarning: "#faad14",
        colorError: "#ff4d4f",
        borderRadius: 8,
        borderRadiusLG: 12,
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    components: {
        Layout: {
            siderBg: "#001529",
            headerBg: "#fff",
        },
        Menu: {
            darkItemBg: "#001529",
            darkItemSelectedBg: "#722ed1",
            darkItemHoverBg: "#722ed140",
        },
        Button: {
            primaryColor: "#fff",
            colorPrimary: "#722ed1",
            colorPrimaryHover: "#531dab",
            colorPrimaryActive: "#391085",
        },
        Input: {
            colorPrimary: "#722ed1",
            colorPrimaryHover: "#531dab",
            controlOutline: "rgba(114, 46, 209, 0.1)",
        },
        Select: {
            colorPrimary: "#722ed1",
            colorPrimaryHover: "#531dab",
            controlOutline: "rgba(114, 46, 209, 0.1)",
        },
        Card: {
            headerBg: "#fafafa",
            colorBorderSecondary: "#f0f0f0",
        },
        Table: {
            headerBg: "#fafafa",
            headerColor: "#262626",
            colorBgContainer: "#ffffff",
        },
        Modal: {
            titleColor: "#262626",
            contentBg: "#ffffff",
        },
        Message: {
            contentBg: "#ffffff",
        },
        Notification: {
            colorBgElevated: "#ffffff",
        },
    },
    algorithm: [
        // You can add dark mode algorithm here if needed
        // theme.darkAlgorithm
    ],
};

// Global error handler
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    // Prevent the default browser error handling
    event.preventDefault();
});

function App() {
    return (
        <ConfigProvider theme={theme}>
            <AntApp>
                <AuthProvider>
                    <ApiProvider>
                        <AppProvider>
                            <RouterProvider router={router} />
                        </AppProvider>
                    </ApiProvider>
                </AuthProvider>
            </AntApp>
        </ConfigProvider>
    );
}

export default App;
