import './SpotDetails.css'
import { IoIosStar } from "react-icons/io";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../store/spots"
import ReviewTile from './ReviewTile';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ReviewModalForm from '../ReviewModalForm/ReviewModalForm';

export default function SpotDetails() {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const { spotReviews } = useSelector(state => state.spots)
    const { session } = useSelector(state => state)
    const { id: userId } = session.user || {}
    const { name, city, state, country, description, price, avgStarRating, numReviews } = spotReviews || {}
    const { firstName, lastName } = spotReviews?.Owner || {}
    const images = spotReviews?.SpotImages || []
    const reviews = spotReviews?.Reviews || []
    const previewImage = images.find(i => i.preview)
    const isOwner = spotReviews?.Owner.id === userId;
    let hasReviews = !spotReviews?.Reviews.filter(r => r.userId === userId);
    console.log({ isOwner, hasReviews });

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId])

    const starArea = avgStarRating === "0.0"
        ? <span className='rating'><IoIosStar style={{ fontSize: "18px" }} />New</span>
        : <>
            <span className='rating'><IoIosStar style={{ fontSize: "18px" }} />{avgStarRating} &#183; </span>
            <span>{numReviews} reviews</span>
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
                        src={previewImage && previewImage.url}
                        alt="preview image" />
                    <div className='images'>
                        {images.filter(i => !i.preview).map(({ id, url }) => {
                            return <img
                                key={id}
                                src={url}
                                alt="image of a property" />
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
                {(!isOwner && !hasReviews) && <OpenModalButton
                    className='primary'
                    style={{ marginBottom: "20px" }}
                    buttonText="Post Your Review"
                    modalComponent={< ReviewModalForm spotId={spotId} />}
                    onModalClose={() => { }}
                >Post Your Review
                </OpenModalButton>}
                {(reviews.length === 0 && !isOwner) && <div style={{ margin: "20px 0" }}>Be the first to leave a review</div>}
                <div className='reviews-container'>
                    {reviews.map(({ id, User, review, updatedAt, stars }) => {
                        return <ReviewTile
                            key={id}
                            name={User.firstName}
                            date={updatedAt}
                            stars={stars}
                            review={review}
                        />
                    })
                    }
                </div>
            </div>
        </div>
    )
}
