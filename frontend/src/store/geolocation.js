import { csrfFetch } from "./csrf";

const LOAD_GEOLOCATION = "geolocation/load"

const retrieveCountry = (results) => {
    const country = results.filter(({ types }) => types[0] === 'country')[0]
    const { long_name, short_name } = country.address_components[0];
    return { long_name, short_name }
}

const addressProcessor = {
    retrieveCountry
}

export const getGeoLocation = () => async (dispatch) => {

    const res = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { coords: { latitude: lat, longitude: lng } } = position;
            const mapRes = await csrfFetch('/api/maps/key', {
                method: "POST"
            })
            const { googleMapsAPIKey: MAPS_API_KEY } = await mapRes.json();
            const addressRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`)
                .catch(error => reject(error))
            const address = await addressRes.json();
            const country = addressProcessor.retrieveCountry(address.results);
            dispatch(loadLocation({ lat, lng, country}));
            resolve({ lat, lng, country});
        }, (error) => {
            reject(error)
        }, { timeout: 5000 })
    });
    return res;
}

export const loadLocation = (location) => {
    return {
        type: LOAD_GEOLOCATION,
        location
    }
}

export default function geolocationreducer(status = {}, action) {
    switch (action.type) {

        case LOAD_GEOLOCATION:
            return { ...status, ...action.location };

        default:
            return status;
    }
}
