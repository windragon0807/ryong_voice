import { useSelector } from "react-redux";
import ToastModal from "./ToastModal";

const MODAL_TYPES = Object.freeze({
    ToastModal: "toast",
});

const MODAL_COMPONENTS = Object.freeze({
    [MODAL_TYPES.ToastModal]: ToastModal,
});

const GlobalModal = () => {
    const { show, type, props } = useSelector((state) => state.modal);

    const renderComponent = () => {
        if (!show) return null;

        const ModalComponent = MODAL_COMPONENTS[type];

        return (
            <ModalComponent {...props} />
        );
    };
    
    return <>{renderComponent()}</>;
};

export default GlobalModal;
