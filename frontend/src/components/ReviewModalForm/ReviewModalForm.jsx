import { useEffect, useState } from 'react';
import './ReviewModal.css';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/review';
import { useModal } from '../../context/Modal';

export default function ReviewModalForm({ spotId }) {

    const dispatch = useDispatch()
    const [review, setReview] = useState('')
    const [isDisabled, setDisabled] = useState(true)
    const [stars, setStars] = useState(0)
    const [error, setError] = useState('')
    const { closeModal } = useModal()

    useEffect(() => {
        if (review.length >= 10) setDisabled(false)
        else setDisabled(true)
    }, [dispatch, review])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(createReview({ spotId, stars, review }))
            .then(res => {
                if (!res.ok) {
                    console.log('res :>> ', res);
                    setError(`${res.message} ${Object.entries(res?.errors).map(([key, message]) => `${key}: ${message}`)}`)
                } else {
                    setError('')
                    closeModal()
                }
            })
    }

    return (
        <form
            className='review-dialog-container'
            onSubmit={onSubmit}>
            <h2>How was Your stay?</h2>
            {error !== '' && <span style={{ marginBottom: "10px" }} className='error'>{error}</span>}
            <textarea
                onChange={e => setReview(e.target.value)}
                name="" id="" placeholder='Leave Your review here ...'
            ></textarea>
            <div className='stars-container'>
                {Array.from({ length: stars }, (v, i) => i + 1).map(star => {
                    return <FaStar key={star} onClick={() => setStars(star - 1)} />
                })}
                {Array.from({ length: 5 - stars }, (v, i) => i + stars + 1).map(star => {
                    return <CiStar key={star} onClick={() => setStars(star)} />
                })}
            </div>
            <button
                className={`primary ${isDisabled && "disabled"}`}
                disabled={isDisabled}
            >Submit Your Review</button>
        </form>
    );
}
