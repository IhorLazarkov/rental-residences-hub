import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/load';
const LOAD_SPOT_DETAILS = 'spotDetails/load';

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

        case LOAD_SPOTS:
            return { ...status, ...action.spots };
        case LOAD_SPOT_DETAILS:
            return { ...status, ...action.spot };

        default:
            return status;
    }
}