import { createSlice } from "@reduxjs/toolkit";

export const ModalSlice = createSlice({
    name: "modal",
    initialState: {
        show: false,
        type: "",
        props: {},
    },
    reducers: {
        setModal: (state, { payload }) => {
            state.type = payload.modalType;
            state.props = payload.modalProps;
            state.show = true;
        },
        hideModal: (state) => {
            state.show = false;
            state.type = "";
            state.props = {};
        },
    },
});

export const { setModal, hideModal } = ModalSlice.actions;
export default ModalSlice.reducer;
