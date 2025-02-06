import './NewSpot.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSpot, getSpotDetails, updateSpot } from '../../store/spots';
import { useParams } from 'react-router-dom';

export default function NewSpot() {

    const dispatch = useDispatch()

    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImg, setPreviewImg] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')

    //Errors
    const [isSubmitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})

    //when edit
    const { spotId } = useParams()
    const { spotReviews } = useSelector(state => state.spots)

    const [isEnabled, setEnabled] = useState(spotId ? true : false)

    const resetForm = () => {
        setStreet('')
        setCity('')
        setCountry('')
        setState('')
        setLatitude('')
        setLongitude('')
        setDescription('')
        setName('')
        setPrice('')
        setPreviewImg('')
        setImage1('')
        setImage2('')
        setImage3('')
        setImage4('')
    }

    useEffect(() => {
        spotId && dispatch(getSpotDetails(spotId))
    }, [dispatch])

    useEffect(() => {

        if (spotReviews && spotId) {

            setStreet(spotReviews?.address)
            setCity(spotReviews?.city)
            setCountry(spotReviews?.country)
            setState(spotReviews?.state)
            setLatitude(spotReviews?.lat)
            setLongitude(spotReviews?.lng)
            setDescription(spotReviews?.description)
            setName(spotReviews?.name)
            setPrice(spotReviews?.price)

            setPreviewImg(spotReviews.SpotImages.find(i => i.preview).url)
            spotReviews.SpotImages.filter(i => !i.preview)
                .forEach(({ url }, i) => {
                    if (i === 0) setImage1(url)
                    if (i === 1) setImage2(url)
                    if (i === 2) setImage3(url)
                    if (i === 3) setImage4(url)
                })

            setErrors({});
        }
    }, [spotReviews?.id])

    useEffect(() => {
        const temp = {};
        if (street === '') temp.street = "Street is required";
        if (city === '') temp.city = "City is required";
        if (country === '') temp.country = "Country is required";
        if (state === '') temp.state = "State is required";
        if (latitude === '') temp.latitude = "required";
        if (longitude === '') temp.longitude = "required";
        if (description === '' || description.length < 30) temp.description = "Description needs a minimum of 30 characters";
        if (name === '') temp.name = "Name is required";
        if (price === '') temp.price = "Price is required";
        // if (previewImg === '') temp.previewImg = "Preview image is required";
        // if (image1 !== '') {
        //     if (image1.indexOf('.png') === -1
        //         && image1.indexOf('.jpg') === -1
        //         && image1.indexOf('.jpeg') === -1) {
        //         temp.image = "Image URL must end in .png, .jpg, or .jpeg";
        //     }
        // }
        setErrors(temp);
        setEnabled(Object.values(errors).length === 0 && name !=='')
    }, [street, city, country, state, latitude, longitude, description, name, price, previewImg, image1])

    const onSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)

        const newSpot = {
            address: street,
            city,
            country,
            state,
            lat: latitude,
            lng: longitude,
            description,
            name,
            price,
            previewImg,
            image1,
            image2,
            image3,
            image4
        }

        if (Object.entries(errors).length > 0) return;

        //update spot
        if (spotId) {
            dispatch(updateSpot({ ...newSpot, spotId }))
                .then(() => {
                    resetForm();
                    setEnabled(false);
                    setSubmitted(false);
                });
        } else {
            //create new spot
            dispatch(createSpot(newSpot))
                .then(() => {
                    resetForm();
                    setEnabled(false);
                    setSubmitted(false);
                })
        }
    }

    return (
        <>
            <form
                id="new-spot-form-container"
                onSubmit={onSubmit}>
                <h2>{spotId ? "Update your" : "Create a new"} Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <p>
                    Guests will only get your exact address once they booked a reservation.
                </p>
                <label htmlFor="country"> Country<span className="error">{isSubmitted && errors?.country}</span></label>
                <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" name="country" id="country" placeholder='Country' />
                <label htmlFor="street">Street Address<span className="error">{isSubmitted && errors?.street}</span> </label>
                <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" name="street" id="street" placeholder='Address' />
                <div className='sub-container'>
                    <span style={{ flexGrow: 1 }}>
                        <label style={{ display: "block" }} htmlFor="city">City<span className="error">{isSubmitted && errors?.city}</span></label>
                        <input onChange={(e) => setCity(e.target.value)} value={city} type="text" name="city" id="city" placeholder='City' />
                    </span>
                    <span>
                        <label style={{ display: "block" }} htmlFor="state">State<span className="error">{isSubmitted && errors?.state}</span></label>
                        <input onChange={(e) => setState(e.target.value)} value={state} type="text" name="state" id="state" placeholder='State' />
                    </span>
                </div>
                <div className='sub-container'>
                    <span style={{ flexGrow: 1 }}>
                        <label style={{ display: "block" }} htmlFor="latitude">Latitude<span className="error">{isSubmitted && errors?.latitude}</span></label>
                        <input onChange={(e) => setLatitude(e.target.value)} value={latitude} type="number" name="latitude" id="latitude" placeholder='Latitude' />
                    </span>
                    <span>
                        <label style={{ display: "block" }} htmlFor="longitude">Longitude<span className="error">{isSubmitted && errors?.longitude}</span></label>
                        <input onChange={(e) => setLongitude(e.target.value)} value={longitude} type="number" name="longitude" id="longitude" placeholder='Logitude' />
                    </span>
                </div>
                <hr />
                <h3>Describe your place to guests</h3>
                <p>
                    Mention the best features of your space, any special amenities like fast wifi or
                    parkingm and what you love about the neighborhood.
                </p>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    name="description"
                    id="description"
                    placeholder='Please write at least 30 characters'></textarea>
                <span className="error">{isSubmitted && errors?.description}</span>
                <hr />
                <h3>Create a title for your spot</h3>
                <p>
                    Catch guest&apos; attention with a spot title highlights what makes
                    yout place special.
                </p>
                <input onChange={(e) => setName(e.target.value)} value={name} style={{ display: "inline" }} type="text" placeholder='Name of your spot' />
                <span className="error">{isSubmitted && errors?.name}</span>
                <hr />
                <h3>Set a base price for your spot</h3>
                <p>
                    Competitive pricing can help your listing stand out and rank higher
                    in each results.
                </p>
                <span style={{ display: "flex", alignItems: "center", width: "100%", gap: "5px" }}>
                    $ <input onChange={(e) => setPrice(e.target.value)} value={price} style={{ width: "100%" }} type="number" placeholder='Price per night (USD)' />
                    <span className="error">{isSubmitted && errors?.price}</span>
                </span>
                <hr />
                <h3>Liven up your spot with photos</h3>
                <p>
                    Submit a link to at least one photo to publish your spot.
                </p>
                <input onChange={(e) => setPreviewImg(e.target.value)} value={previewImg} type="text" placeholder='Preview image URL' />
                <span className="error">{isSubmitted && errors?.previewImg}</span>
                <input onChange={(e) => setImage1(e.target.value)} value={image1} type="text" placeholder='Image URL' />
                <span className="error">{isSubmitted && errors?.image}</span>
                <input onChange={(e) => setImage2(e.target.value)} value={image2} type="text" placeholder='Image URL' />
                <input onChange={(e) => setImage3(e.target.value)} value={image3} type="text" placeholder='Image URL' />
                <input onChange={(e) => setImage4(e.target.value)} value={image4} type="text" placeholder='Image URL' />
                <button
                    className={isEnabled ? "primary" : "disabled"}
                    type="submit"
                >{spotId ? "Update your" : "Create"} Spot</button>
            </form>
        </>
    );
}
