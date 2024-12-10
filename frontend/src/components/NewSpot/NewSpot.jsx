import './NewSpot.css'

export default function NewSpot() {

    const onSubmit = () => {

    }

    return (
        <>
            <form id="new-spot-form-container">
                <h2>Create a new Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <p>
                    Guests will only get your exact address once they booked a reservation.
                </p>
                <label htmlFor="country"> Country</label>
                <input type="text" name="country" id="country" placeholder='Country' />
                <label htmlFor="streetAddress">Street Adress</label>
                <input type="text" name="streetAddress" id="streetAddress" placeholder='Address' />
                <div className='sub-container'>
                    <span style={{ flexGrow: 1 }}>
                        <label style={{ display: "block" }} htmlFor="city">City</label>
                        <input type="text" name="city" id="city" placeholder='City' />
                    </span>
                    <span>
                        <label style={{ display: "block" }} htmlFor="state">State</label>
                        <input type="text" name="state" id="state" placeholder='State' />
                    </span>
                </div>
                <div className='sub-container'>
                    <span style={{ flexGrow: 1 }}>
                        <label style={{ display: "block" }} htmlFor="latitude">Latitude</label>
                        <input type="text" name="latitude" id="latitude" placeholder='Latitude' />
                    </span>
                    <span>
                        <label style={{ display: "block" }} htmlFor="longitude">Longitude</label>
                        <input type="text" name="longitude" id="longitude" placeholder='Logitude' />
                    </span>
                </div>
                <hr />
                <h3>Describe your place to guests</h3>
                <p>
                    Mention the best features of your space, any special amenities like fast wifi or
                    parkingm and what you love about the neighborhood.
                </p>
                <textarea
                    name="description"
                    id="description"
                    placeholder='Please write at least 30 characters'></textarea>
                <hr />
                <h3>Create a title for your spot</h3>
                <p>
                    Catch guest&apos; attention with a spot title highlights what makes
                    yout place special.
                </p>
                <input style={{ display: "inline" }} type="text" placeholder='Name of your spot' />
                <hr />
                <h3>Set a base price for your spot</h3>
                <p>
                    Competitive pricing can help your llisting stand out and rank higher
                    in each results.
                </p>
                <span style={{ display: "flex", alignItems: "center", width: "100%", gap: "5px" }}>
                    $ <input style={{ width: "100%" }} type="text" placeholder='Price per night (USD)' />
                </span>
                <hr />
                <h3>Liven up your spot with photos</h3>
                <p>
                    Submit a link to at least one photo to publish your spot.
                </p>
                <input type="text" placeholder='Preview image URL' />
                <input type="text" placeholder='Image URL' />
                <input type="text" placeholder='Image URL' />
                <input type="text" placeholder='Image URL' />
                <input type="text" placeholder='Image URL' />
                <input type="text" placeholder='Image URL' />
                <span>
                    <button
                        className='primary'
                        type="submit"
                        onSubmit={onSubmit}>Create Spot</button>
                </span>
            </form>
        </>
    );
}
