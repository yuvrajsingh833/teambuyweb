import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import * as Utils from '../lib/utils'
import * as UserService from "../services/user";

import * as Validations from "../lib/validation";

export default function RateProductModal(props) {
    const [showModal, setShowModal] = useState(props.showModal);
    const [productId, setProductId] = useState(props.productId);

    const [showThanksModal, setShowThanksModal] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);

    useEffect(() => {
        setShowModal(props.showModal)
        setProductId(props.productId)
        setShowThanksModal(false)
    }, [props]);

    const submitReview = () => {
        UserService.addProductReview({ productID: productId, rating: rating, comment: comment }).then(response => {
            setShowThanksModal(true)
        }).catch(error => {
            console.log(`addProductReview error : ${error}`)
            setCommentError(error.message)
        })
    }

    const handleRating = () => {
        let commentValidation = Validations.validateField(comment, { emptyField: 'comment cannot be blank' })
        let error = null;

        if (commentValidation.error && rating == 0) {
            error = 'Please enter rating or feedback'
        }

        if (error != null) {
            setCommentError(error)
            return false;
        } else {
            submitReview()
        }
    }

    return (
        !showThanksModal ? <Modal
            className="modal fade sm-modal"
            aria-labelledby="staticBackdropLabel"
            centered
            backdrop="static"
            keyboard={false}
            show={showModal}
            onHide={typeof props.onCancelPress === 'function' ? props.onCancelPress : () => { }}>
            <div className="modal-header">
                <h5 className="modal-title" >Rate the product</h5>
            </div>
            <div className="modal-body">
                <form className="custom-form">
                    <div className="form-group">
                        <div className="xs-heading fw-500">How would you like to rate this product?</div>
                        <div className="r-rating mt-6">
                            <Image layout="raw" height={20} width={15} style={{ objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', marginRight: '5px' }} onClick={() => setRating(1)} quality={100} alt="rating-star" src={(rating > 0) ? "/img/fill-star.svg" : "/img/blank-star.svg"} />
                            <Image layout="raw" height={20} width={15} style={{ objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', marginRight: '5px' }} onClick={() => setRating(2)} quality={100} alt="rating-star" src={(rating > 1) ? "/img/fill-star.svg" : "/img/blank-star.svg"} />
                            <Image layout="raw" height={20} width={15} style={{ objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', marginRight: '5px' }} onClick={() => setRating(3)} quality={100} alt="rating-star" src={(rating > 2) ? "/img/fill-star.svg" : "/img/blank-star.svg"} />
                            <Image layout="raw" height={20} width={15} style={{ objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', marginRight: '5px' }} onClick={() => setRating(4)} quality={100} alt="rating-star" src={(rating > 3) ? "/img/fill-star.svg" : "/img/blank-star.svg"} />
                            <Image layout="raw" height={20} width={15} style={{ objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', marginRight: '5px' }} onClick={() => setRating(5)} quality={100} alt="rating-star" src={(rating > 4) ? "/img/fill-star.svg" : "/img/blank-star.svg"} />
                        </div>
                    </div>
                    <div className="form-group mt-10">
                        <div className="xs-heading fw-500">Do you have any additional comment?</div>
                        <textarea className="form-control review-control mt-10" placeholder="Please enter your review" onChange={(event) => { setComment(event.target.value) }} value={comment}></textarea>
                        <span style={{ fontSize: '12px', color: '#D83734', fontFamily: 'Poppins' }}>{commentError}</span>
                    </div>
                    <div className="d-flex align-items-center mt-10">
                        <div className="w-50">
                            <button className="cancel-btn w-100" type="button" onClick={typeof props.onCancelPress === 'function' ? props.onCancelPress : () => { }} >cancel</button>
                        </div>
                        <div className="w-50 ml-auto">
                            <button className="green-btn w-100" type="button" onClick={() => handleRating()} >{Utils.getLanguageLabel("SUBMIT")}</button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal> : <Modal
            className="modal fade sm-modal"
            aria-labelledby="staticBackdropLabel"
            centered
            backdrop="static"
            keyboard={false}
            show={showModal}
            onHide={typeof props.onCancelPress === 'function' ? props.onCancelPress : () => { }}>
            <div className="modal-header">
                <h5 className="modal-title">{Utils.getLanguageLabel("Thanks for your feedback")}</h5>
            </div>
            <div className="modal-body">
                <div className="check-icon text-center">
                    <Image alt='check' layout='raw' height={100} width={100} quality={100} src="/img/check.png" />
                </div>
                <div className="xs-heading text-center mt-10">{Utils.getLanguageLabel("Your feedback matter us a lot in")} <br />{Utils.getLanguageLabel("improving our quality.")}</div>
                <div className="mt-10 text-center">
                    <button className="green-btn" type="button" onClick={typeof props.onCancelPress === 'function' ? props.onCancelPress : () => { }}>{Utils.getLanguageLabel("Close")}</button>
                </div>
            </div>
        </Modal>
    )
}