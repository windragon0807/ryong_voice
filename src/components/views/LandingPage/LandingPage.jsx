import { useNavigate } from "react-router-dom";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <AwesomeText className="mb-4" onClick={() => navigate("/record")} pointer>đī¸ ëšėíę¸°</AwesomeText>
        </Box>
    );
};

export default LandingPage;
