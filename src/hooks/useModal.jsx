import { useDispatch } from "react-redux";
import { setModal, hideModal } from "redux/slices/ModalSlice";

const useModal = () => {
    const dispatch = useDispatch();

    const showModal = ({ modalType, modalProps }) => {
        dispatch(setModal({ modalType, modalProps }));
    };

    const closeModal = () => {
        dispatch(hideModal());
    };

    return [showModal, closeModal];
};

export default useModal;
