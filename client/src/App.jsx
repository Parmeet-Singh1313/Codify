// App.jsx
import { Route, Routes } from "react-router-dom";
import AppProvider from "./components/context/AppProvider";
import GitHubCorner from "./components/GitHubCorner";
import EditorPage from "./components/pages/EditorPage";
import HomePage from "./components/pages/HomePage";
import Toast from "./components/toast/Toast";

const App = () => {
    return (
        <AppProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/editor/:roomId" element={<EditorPage />} />
            </Routes>
            <Toast />
            <GitHubCorner />
        </AppProvider>
    );
};

export default App;