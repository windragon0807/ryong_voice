import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import { Box } from "styles/common/layout";
import { AwesomeText } from "styles/common/component";
import useModal from "hooks/useModal";
import useRecord from 'hooks/useRecord';

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal] = useModal();
    
    useRecord();

    useEffect(() => {
        
    }, []);

    const handleClick = () => {
        showModal({
            modalType: "toast",
            modalProps: {
                message: "Modal Test",
            },
        });
    };

    return (
        <Box>
            <AwesomeText className="mb-4">로그인을 해주세요.</AwesomeText>
            <Button className="mb-4" onClick={() => handleClick()}>🎁 Modal</Button>
            <Link to="/record">
                <Button variant="success">🎙️ 녹음하기</Button>
            </Link>
        </Box>
    );
};

export default LandingPage;
