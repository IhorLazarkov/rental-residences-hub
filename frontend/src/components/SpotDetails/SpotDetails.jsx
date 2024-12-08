import './SpotDetails.css'
import { IoIosStar } from "react-icons/io";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getReviews, getSpot } from "../../store/spots"

export default function SpotDetails() {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)

    //State
    const [spot, setSpot] = useState({})
    const [previewImage, setPreviewImage] = useState('')
    const [images, setImages] = useState([])
    const [owner, setOwner] = useState({})

    useEffect(() => {
        dispatch(getSpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        setSpot(spots)
        spots.Owner && setOwner(spots.Owner)
        spots.SpotImages && setPreviewImage(spots.SpotImages.find(i => i.preview))
        spots.SpotImages && setImages(spots.SpotImages.filter(i => !i.preview))
    }, [spots.id])

    return (

        <div className="spot-details-container">
            <div className='spot-details-head'>
                <div className="name">{spot.name}</div>
                <div className="address">{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div className='spot-details-body'>
                <div className='photos-container'>
                    <img className="preview"
                        src={previewImage.url}
                        alt="preview image" />
                    <div className='images'>
                        {images.map(image => {
                            return <img key={image.id} src={image.url} alt="image of an property" />
                        })}
                    </div>
                </div>
                <div className='property-description-container'>
                    <div>
                        <h3>Hosted by {owner.firstName} {owner.lastName}</h3>
                        <p>{spot.description}</p>
                    </div>
                    <div className='actions'>
                        <div className='summary'>
                            <span><span className='price'>${spot.price}</span> night</span>
                            <span>
                                <span className='rating'><IoIosStar style={{ fontSize: "18px" }} /> {spot.avgStarRating}</span>
                                <span>{spot.numReviews} &#183; reviews</span>
                            </span>
                        </div>
                        <button>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='spot-details-foot'></div>
        </div>
    )
}
