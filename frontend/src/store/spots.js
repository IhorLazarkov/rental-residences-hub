import { csrfFetch } from "./csrf";

const NEW_SPOT = "spots/new"
const LOAD_SPOTS = 'spots/load';
const LOAD_SPOT_DETAILS = 'spotDetails/load';

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

export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const data = await res.json();
    dispatch(loadSpots(data))
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
    dispatch(loadSpots(data))
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

export default function spotsReducer(status = {}, action) {
    switch (action.type) {

        case NEW_SPOT:
            return { ...status, newSpot: action.newSpot };
        case LOAD_SPOTS:
            return { ...status, ...action.spots };
        case LOAD_SPOT_DETAILS:
            return { ...status, ...action.spot };

        default:
            return status;
    }
}