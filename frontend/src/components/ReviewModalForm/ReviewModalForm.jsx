import { useEffect, useState } from 'react';
import './ReviewModal.css';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { createReview, getCurrentReviews, getReviews, updateReview } from '../../store/review';
import { useModal } from '../../context/Modal';

export default function ReviewModalForm({ action, spotId, spotName, reviewId, reviewMessage = "", starsInit = 0 }) {

    const dispatch = useDispatch()
    const [review, setReview] = useState(reviewMessage)
    const [isDisabled, setDisabled] = useState(true)
    const [stars, setStars] = useState(starsInit)
    const [error, setError] = useState('')
    const { closeModal } = useModal()
    const [isUpdate, setUpdate] = useState(action === "updateCurrent")

    useEffect(() => {
        if (review.length >= 10 && stars !== 0) setDisabled(false)
        else setDisabled(true)
    }, [dispatch, review, stars])

    const onSubmit = (e) => {
        e.preventDefault()
        switch (action) {
            case "updateSpotReviews":
                setUpdate(true)
                dispatch(updateReview({ reviewId, stars, review }))
                    .then(res => {
                        if (!res.ok) {
                            setError(`${res.message} ${Object.entries(res?.errors).map(([key, message]) => `${key}: ${message}`)}`)
                        } else {
                            setError('')
                            closeModal()
                            dispatch(getReviews(spotId))
                        }
                    })
                break;

            case "updateCurrent":
                setUpdate(true)
                dispatch(updateReview({ reviewId, stars, review }))
                    .then(res => {
                        if (!res.ok) {
                            setError(`${res.message} ${Object.entries(res?.errors).map(([key, message]) => `${key}: ${message}`)}`)
                        } else {
                            setError('')
                            closeModal()
                            dispatch(getCurrentReviews())
                        }
                    })
                break;

            case "create":
                setUpdate(false)
                dispatch(createReview({ spotId, stars, review }))
                    .then(res => {
                        if (!res.ok) {
                            setError(`${res.message} ${Object.entries(res?.errors).map(([key, message]) => `${key}: ${message}`)}`)
                        } else {
                            setError('')
                            closeModal()
                            dispatch(getReviews(spotId))
                        }
                    })
        }
    }

    return (
        <form
            className='review-dialog-container'
            onSubmit={onSubmit}>
            <h2>How was your stay {isUpdate && `at ${spotName}`}?</h2>
            {error !== '' && <span style={{ marginBottom: "10px" }} className='error'>{error}</span>}
            <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder='Leave Your review here ...'
            ></textarea>
            <div className='stars-container'>
                {Array.from({ length: stars }, (v, i) => i + 1).map(star => {
                    return <FaStar key={star} onClick={() => setStars(star - 1)} />
                })}
                {Array.from({ length: 5 - stars }, (v, i) => i + stars + 1).map(star => {
                    return <CiStar key={star} onClick={() => setStars(star)} />
                })}
                <span>Stars</span>
            </div>
            <button
                className={`primary ${isDisabled && "disabled"}`}
                disabled={isDisabled}
            >{isUpdate ? "Update" : "Submit"} Your Review</button>
        </form>
    );
}
