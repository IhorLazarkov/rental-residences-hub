import './SpotDetails.css'
import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import ReviewTile from './ReviewTile';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ReviewModalForm from '../ReviewModalForm/ReviewModalForm';
import { getReviews } from '../../store/review';
import DeleteConfirmatinModal from '../DeleteConfirmationModal/DeleteConfirmatinModal';
import MapContainer from '../MapPage/MapContainer';
import ImgComp from './ImgComp';

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
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()
    const [avgStarRating, setRating] = useState(0)
    const [numReviews, setNumReviews] = useState(0)

    //Review logic
    const [isOwner, setIsOwner] = useState(false)
    const [hasReviews, setHasReviews] = useState(false)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        if (spotId) dispatch(getReviews(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        if (Object.entries(spot).length > 0 && spot.Owner) {
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
            setLat(spot.lat)
            setLng(spot.lng)

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
                    <div className="preview">
                        <ImgComp url={previewImage?.url} />
                    </div>
                    <div className='images'>
                        {images.map(({ url }, i) => {
                            return <ImgComp key={i} url={url} />
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
            <div className="spot-details-map">
                <MapContainer
                    lat={lat}
                    lng={lng}
                />
            </div>
            <div className='spot-details-foot'>
                <div className='reviews-summary'>
                    {starArea}
                </div>
                {(!isOwner && !hasReviews && userId) && <OpenModalButton
                    className='primary'
                    style={{ marginBottom: "20px" }}
                    buttonText="Post Your Review"
                    modalComponent={< ReviewModalForm
                        action="create"
                        spotId={spotId}
                    />}
                >Post Your Review
                </OpenModalButton>}
                {(numReviews === 0 && !isOwner) && <div style={{ margin: "20px 0" }}>Be the first to leave a review</div>}
                <div className='reviews-container'>
                    {reviews.map(({ id: reviewId, User, review, updatedAt, stars }) => {
                        return <div key={reviewId}>
                            <ReviewTile
                                name={User.firstName}
                                date={updatedAt}
                                stars={stars}
                                review={review}
                            />
                            {userId && User.id === userId &&
                                <div
                                    style={{ marginBottom: "10px" }}
                                    className="review-actions-container">

                                    <OpenModalButton
                                        className="secondary"
                                        buttonText="Update"
                                        modalComponent={<ReviewModalForm
                                            action="updateSpotReviews"
                                            spotId={spotId}
                                            reviewId={reviewId}
                                            reviewMessage={review}
                                            starsInit={stars} />
                                        } />

                                    <OpenModalButton
                                        className="critical"
                                        buttonText="Delete"
                                        modalComponent={<DeleteConfirmatinModal
                                            action="updateSpotReviews"
                                            spotId={spotId}
                                            reviewId={reviewId}
                                            title="Confirm Delete"
                                            message="Are you sure you want to delete this review?"
                                            confirmMessage="Yes (Delete Review)"
                                            abortMessage="No (Keep Review)"
                                        />}
                                    />
                                </div>
                            }
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}
