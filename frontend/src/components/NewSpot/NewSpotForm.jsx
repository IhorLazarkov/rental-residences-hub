import './NewSpot.css'
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { createSpot } from '../../store/spots';

export default function NewSpot() {

    const dispatch = useDispatch()

    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [previewImg, setPreviewImg] = useState('')
    const [image1, setImage1] = useState('')
    const [image2, setImage2] = useState('')
    const [image3, setImage3] = useState('')
    const [image4, setImage4] = useState('')

    //Errors
    const [isSubmitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setErrors({})
        street === '' && setErrors(prev => prev = { ...prev, street: "Street is required" });
        city === '' && setErrors(prev => prev = { ...prev, city: "City is required" });
        country === '' && setErrors(prev => prev = { ...prev, country: "Country is required" });
        state === '' && setErrors(prev => prev = { ...prev, state: "State is required" });
        latitude === 0 && setErrors(prev => prev = { ...prev, latitude: "required" });
        longitude === 0 && setErrors(prev => prev = { ...prev, longitude: "required" });
        if (description === '' || description.length < 30) setErrors(prev => prev = { ...prev, description: "Description needs a minimum of 30 characters" });
        name === '' && setErrors(prev => prev = { ...prev, name: "Name is required" });
        price === 0 && setErrors(prev => prev = { ...prev, price: "Price is required" });
        previewImg === '' && setErrors(prev => prev = { ...prev, previewImg: "Preview image is required" });
        if (image1 !== '' && !(
            image1.indexOf('.png') > -1
            || image1.indexOf('.jpg') > -1
            || image1.indexOf('.jpeg') > -1)
        ) setErrors(prev => prev = { ...prev, image: "Image URL must end in .png, .jpg, or .jpeg" });

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

        console.log({ errors, newSpot });
        if (Object.entries(errors).length > 0) return;

        dispatch(createSpot(newSpot))
            .then(() => {

                setStreet('')
                setCity('')
                setCountry('')
                setState('')
                setLatitude(0)
                setLongitude(0)
                setDescription('')
                setName('')
                setPrice(0)
                setPreviewImg('')
                setImage1('')
                setImage2('')
                setImage3('')
                setImage4('')

                setSubmitted(false);
            })
    }

    return (
        <>
            <form
                id="new-spot-form-container"
                onSubmit={onSubmit}>
                <h2>Create a new Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <p>
                    Guests will only get your exact address once they booked a reservation.
                </p>
                <label htmlFor="country"> Country<span className="error">{isSubmitted && errors?.country}</span></label>
                <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" name="country" id="country" placeholder='Country' />
                <label htmlFor="street">Street Adress<span className="error">{isSubmitted && errors?.street}</span> </label>
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
                    Competitive pricing can help your llisting stand out and rank higher
                    in each results.
                </p>
                <span style={{ display: "flex", alignItems: "center", width: "100%", gap: "5px" }}>
                    $ <input onChange={(e) => setPrice(e.target.value)} value={price} style={{ width: "100%" }} type="text" placeholder='Price per night (USD)' />
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
                <span>
                    <button
                        className='primary'
                        type="submit"
                    >Create Spot</button>
                </span>
            </form>
        </>
    );
}
