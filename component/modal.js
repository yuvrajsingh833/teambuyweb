import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Utils from "../lib/utils";

const ConfirmModal = (props) => {
    const [showModal, setShowModal] = useState(props.showModal);

    useEffect(() => {
        setShowModal(props.showModal)
    }, [props]);

    return (
        <>
            <Modal
                className="modal fade sm-modal"
                centered
                keyboard={false}
                show={showModal}
                onHide={typeof props.onConfirmPress === 'function' ? props.onConfirmPress : () => { }}>
                <div className="modal-body">
                    <div className="dtl-heading">{Utils.getLanguageLabel(props.title || 'Are you sure?')}</div>
                    <div className="form-group mt-10">
                        <div className="xs-heading fw-500">{Utils.getLanguageLabel(props.subTitle)}</div>
                    </div>
                    <div className="d-flex align-items-center mt-10">
                        <div className=" mr-auto">
                            <button className="cancel-btn" onClick={typeof props.onCancelPress === 'function' ? props.onCancelPress : () => { }} type="button" >{Utils.getLanguageLabel(props.cancelText || "Cancel")}</button>
                        </div>
                        <div className=" ml-auto">
                            <button className="green-btn" onClick={typeof props.onConfirmPress === 'function' ? props.onConfirmPress : () => { }} type="button" data-bs-dismiss="modal">{Utils.getLanguageLabel(props.okayText || "Okay")}</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export {
    ConfirmModal
};
