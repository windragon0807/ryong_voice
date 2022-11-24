import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";

const LandingPage = () => {
    return (
        <Box>
            <AwesomeText className="mb-4">메뉴 선택</AwesomeText>
            <Link to="/record">
                <Button variant="primary">🎙️ 녹음하기</Button>
            </Link>
        </Box>
    );
};

export default LandingPage;
