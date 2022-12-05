import styled, { keyframes, css } from "styled-components";

const backgroundAnim = keyframes`
    0% { background-position: 0 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
`;

const textFloatingAnim = keyframes`
    0% { transform: translateY(0); }
    20% { transform: translateY(2px); }
    30% { transform: translateY(0); }
    50% { transform: translateY(2px); }
    60% { transform: translateY(0); }
    80% { transform: translateY(2px); }
    90% { transform: translateY(0); }
`;

export const AwesomeText = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    display: inline-block;
    animation: ${backgroundAnim} 5s ease-out infinite, ${textFloatingAnim} 5s ease-out infinite !important;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 250% 500%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    ${({ pointer }) => pointer && css`
        cursor: pointer;
    `}
`;

export const Wave = styled.div`
    width: 50%;
    height: 90px;
`;