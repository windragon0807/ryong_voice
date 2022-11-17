import { createPortal } from "react-dom";
import GlobalModal from "./GlobalModal";

const element = document.querySelector("#modal");

const Modal = () => {
    return createPortal(<GlobalModal />, element);
};

export default Modal;
