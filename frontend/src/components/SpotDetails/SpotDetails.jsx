import './SpotDetails.css'
import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ReviewTile from './ReviewTile';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ReviewModalForm from '../ReviewModalForm/ReviewModalForm';
import { deleteReview, getReviews } from '../../store/review';
import DeleteConfirmatinModal from '../DeleteConfirmationModal/DeleteConfirmatinModal';

export default function SpotDetails() {
    const { spotId } = useParams()

    const dispatch = useDispatch()
    const spot = useSelector(state => state.reviews)
    const { user } = useSelector(state => state.session)
    const [reviews, setReviews] = useState([])

    //Spot related stuff
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [previewImage, setPreviewImage] = useState({})
    const [images, setImages] = useState([{}])
    const [price, setPrice] = useState()
    const [avgStarRating, setRating] = useState(0)
    const [numReviews, setNumReviews] = useState(0)

    //Review logic
    const [isOwner, setIsOwner] = useState(false)
    const [hasReviews, setHasReviews] = useState(false)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        dispatch(getReviews(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        if (Object.entries(spot).length > 0) {
            setFirstName(spot.Owner.firstName)
            setLastName(spot.Owner.lastName)
            setName(spot.name)
            setCity(spot.city)
            setCountry(spot.country)
            setState(spot.state)
            setDescription(spot.description)
            setPrice(spot.price)
            setRating(spot.avgStarRating)
            setNumReviews(spot.numReviews)

            setReviews(spot.Reviews)
            const spotImages = spot.SpotImages.filter(i => !i.preview)
            setImages(spotImages)
            const showcaseImage = spot.SpotImages.find(i => i.preview)
            setPreviewImage(showcaseImage)

            if (userId) {
                setIsOwner(spot.Owner.id === userId)
                const isReviewes = spot.Reviews.filter(r => r.userId === userId).length !== 0;
                setHasReviews(isReviewes)
            }
        }
    }, [spot])

    useEffect(() => {
        if (user) setUserId(user.id)
        else setUserId(user)
    }, [user])

    // const onDelete = (reviewId) => {
    //     dispatch(deleteReview(reviewId))
    // }

    const starArea = numReviews === 0
        ? <span className='rating'><IoIosStar style={{ fontSize: "18px" }} />New</span>
        : <>
            <span className='rating'><IoIosStar style={{ fontSize: "18px" }} />{avgStarRating} &#183; </span>
            <span>{numReviews === 1 ? `${numReviews} review` : `${numReviews} reviews`}</span>
        </>

    return (

        <div className="spot-details-container">
            <div className='spot-details-head'>
                <div className="name">{name}</div>
                <div className="address">{city}, {state}, {country}</div>
            </div>
            <div className='spot-details-body'>
                <div className='photos-container'>
                    <img className="preview"
                        src={previewImage?.url}
                        alt="preview image" />
                    <div className='images'>
                        {images.map(({ id, url }) => {
                            return <img
                                key={id}
                                src={url}
                                alt="image of a spot" />
                        })}
                    </div>
                </div>
                <div className='property-description-container'>
                    <div>
                        <h3>Hosted by {firstName} {lastName}</h3>
                        <p>{description}</p>
                    </div>
                    <div className='actions'>
                        <div className='summary'>
                            <span><span className='price'>${price}</span> night</span>
                            <span>
                                {starArea}
                            </span>
                        </div>
                        <button
                            className='primary'
                            onClick={() => alert("Feature Commitg soon ...")}
                        >Reserve</button>
                    </div>
                </div>
            </div>
            <div className='spot-details-foot'>
                <div className='reviews-summary'>
                    {starArea}
                </div>
                {(!isOwner && !hasReviews && userId) && <OpenModalButton
                    className='primary'
                    style={{ marginBottom: "20px" }}
                    buttonText="Post Your Review"
                    modalComponent={< ReviewModalForm spotId={spotId} />}
                >Post Your Review
                </OpenModalButton>}
                {(numReviews === 0 && !isOwner) && <div style={{ margin: "20px 0" }}>Be the first to leave a review</div>}
                <div className='reviews-container'>
                    {reviews.map(({ id: reviewId, User, review, updatedAt, stars }) => {
                        return <>
                            <ReviewTile
                                key={reviewId}
                                name={User.firstName}
                                date={updatedAt}
                                stars={stars}
                                review={review}
                            />
                            {userId && User.id === userId && <OpenModalButton
                                key={reviewId + userId}
                                className="critical"
                                style={{marginBottom:"10px"}}
                                buttonText="Delete Review"
                                modalComponent={<DeleteConfirmatinModal
                                    reviewId={reviewId}
                                    spotId={spotId}
                                    title="Confirm Delete"
                                    message="Are you sure you want to delete this review?"
                                    confirmMessage="Yes (Delete Review)"
                                    abortMessage="No (Keep Review)"
                                />}
                            />}
                        </>
                    })}
                </div>
            </div>
        </div>
    )
}
