import styled from "styled-components";
import { motion } from "framer-motion";
import bounce from "styles/animation/bounce";
import useTimeout from "hooks/useTimeout";
import useModal from "hooks/useModal";

const ToastModal = ({
    message = "먼저 동의해주세요", 
    time = 1000,
}) => {
    const [, closeModal] = useModal();
    useTimeout(time, closeModal);

    return (
        <Container>
            <Wrapper>
                <Toast as={motion.div} initial="off" animate="on" variants={bounce} custom={0}>
                    {message}
                </Toast>
            </Wrapper>
        </Container>
    );
};

const Container = styled.div`
    width: 500px;
    height: 500px;
    /* position: fixed;
    top: 0;
    left: 0; */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
`;

const Wrapper = styled.div`
    position: absolute;
    bottom: 215px;
`;

const Toast = styled.div`
    background-color: ${({ theme }) => theme.black};
    padding: 8px 16px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;    
    color: ${({ theme }) => theme.white};
    font-size: 36px;
    font-weight: 600;
    line-height: 150%;
`;

export default ToastModal;