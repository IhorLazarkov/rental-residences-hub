import './SpotDetails.css'
import { IoIosStar } from "react-icons/io";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../store/spots"
import ReviewTile from './ReviewTile';

export default function SpotDetails() {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const { spotDetails, spotReviews } = useSelector(state => state.spots)
    const { name, city, state, country, description, price, avgStarRating, numReviews } = spotDetails || {}
    const { firstName, lastName } = spotDetails?.Owner || {}
    const images = spotDetails?.SpotImages || []
    const reviews = spotReviews?.Reviews || []
    const previewImage = images.find(i => i.preview)

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId])

    return (

        <div className="spot-details-container">
            <div className='spot-details-head'>
                <div className="name">{name}</div>
                <div className="address">{city}, {state}, {country}</div>
            </div>
            <div className='spot-details-body'>
                {previewImage && <div className='photos-container'>
                    <img className="preview"
                        src={previewImage.url}
                        alt="preview image" />
                    {images.map(image => {
                        <div className='images'>
                            return <img key={image.id} src={image.url} alt="image of an property" />
                        </div>
                    })}
                </div>
                }
                <div className='property-description-container'>
                    <div>
                        <h3>Hosted by {firstName} {lastName}</h3>
                        <p>{description}</p>
                    </div>
                    <div className='actions'>
                        <div className='summary'>
                            <span><span className='price'>${price}</span> night</span>
                            <span>
                                <span className='rating'><IoIosStar style={{ fontSize: "18px" }} /> {avgStarRating} &#183; </span>
                                <span>{numReviews} reviews</span>
                            </span>
                        </div>
                        <button>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='spot-details-foot'>
                <div className='reviews-summary'>
                    <span className='rating'><IoIosStar style={{ fontSize: "18px" }} /> {avgStarRating} &#183; </span>
                    <span>{numReviews} reviews</span>
                </div>
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