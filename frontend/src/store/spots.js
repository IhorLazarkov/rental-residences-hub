import { csrfFetch } from "./csrf";
import { getFilters } from "./filter";

const NEW_SPOT = "spots/new"
const LOAD_SPOTS = 'spots/load';
const LOAD_SPOT_DETAILS = 'spotDetails/load';

//General work with spots
export const createSpot = (spot) => async (dispatch) => {
    //Save new spot
    const resSpot = await csrfFetch('/api/spots', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })
    const dataNewSpot = await resSpot.json()
    const newSpotId = dataNewSpot.id
    const { previewImg } = spot
    //save images
    const resPreviewImg = await csrfFetch(`/api/spots/${newSpotId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: previewImg, preview: true })
    })
    Array.from(["image1", "image2", "image3", "image4"])
        .map(name => spot[name])
        .filter(url => url !== '')
        .forEach(async url => {
            await csrfFetch(`/api/spots/${newSpotId}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, preview: false })
            })
        });
    dispatch(newSpot({ id: newSpotId }))
    return { resSpot, resPreviewImg };
};

export const updateSpot = (updatedSpot) => async (dispatch) => {
    const { spotId } = updatedSpot
    const resSpot = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSpot)
    })
    dispatch(newSpot({ id: spotId }))
    return { resSpot };
}

export const deleteSpot = (id) => async (dispatch) => {
    const resDelete = await csrfFetch(`/api/spots/${id}`, { method: "DELETE" })
    dispatch(loadCurrentSpots())
    return resDelete;
}

const normalize = (Spots) => {
    const spots = {}
    for (let i = 0; i < Spots.length; i++) {
        const spot = { ...Spots[i] }
        spots[spot.id] = spot
    }
    return spots;
}

export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const { Spots } = await res.json();
    dispatch(loadSpots(normalize(Spots)))
    return res;
}

export const getSpotDetails = (spotId) => async (dispatch) => {
    const resSpot = await csrfFetch(`/api/spots/${spotId}`)
    const dataSpotDetails = await resSpot.json()
    const resReview = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const dataReview = await resReview.json()

    dispatch(loadSpotDetails({
        spotDetails: dataSpotDetails,
        spotReviews: dataReview
    }))
    return { resSpot, resReview };
}

export const loadCurrentSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const data = await res.json()
    dispatch(loadSpots(normalize(data.Spots)))
    return res;
}

const newSpot = (newSpot) => {
    return {
        type: NEW_SPOT,
        newSpot
    }
};
function loadSpots(spots) {
    return {
        type: LOAD_SPOTS,
        spots
    }
}
function loadSpotDetails(spot) {
    return {
        type: LOAD_SPOT_DETAILS,
        spot
    }
}

//Filtering
export const filterSpots = (filter) => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const { Spots } = await res.json()

    dispatch(getFilters(Spots));

    if (Object.values(filter).length === 0) return dispatch(loadSpots(normalize(Spots)))

    //apply filter
    const filteredSpots = Spots.filter(spot => {
        let isMatch = true;
        Object.entries(filter).map(([key, value]) => {
            //change match index only when prev was successful match
            //otherwise this element is not match
            if (isMatch) {
                if (key.toLocaleLowerCase().includes("minprice")) {
                    isMatch = spot.price >= value;
                }
                else if (key.toLocaleLowerCase().includes('maxprice')) {
                    isMatch = spot.price <= value;
                }
                else isMatch = spot[key] === value;
            }
        });
        return isMatch;
    });

    dispatch(loadSpots(normalize(filteredSpots)));
    return res;
}

export default function spotsReducer(status = {}, action) {
    switch (action.type) {

        case NEW_SPOT:
            return { ...status, newSpot: action.newSpot };
        case LOAD_SPOTS:
            status = { ...action.spots }
            return { ...status };
        case LOAD_SPOT_DETAILS:
            status = { ...action.spot }
            return { ...status };

        default:
            return status;
    }
}