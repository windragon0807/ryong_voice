import { Routes, Route } from "react-router-dom";
import LandingPage from "components/views/LandingPage/LandingPage";
import RecordingPage from "components/views/RecordingPage/RecordingPage";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/record" element={<RecordingPage />} />
        </Routes>
    );
};

export default Router;
