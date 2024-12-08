import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/load';
const LOAD_SPOT = 'spot/load';
const LOAD_REVIEWS = 'reviews/load'

export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const data = await res.json();
    dispatch(loadSpots(data))
    return res;
}

export const getSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const data = await res.json()
    dispatch(loadSpot(data))
    return res;
}

export const getReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await res.json()
    dispatch(loadReviews(data))
    return res;
}

function loadSpots(spots) {
    return {
        type: LOAD_SPOTS,
        spots
    }
}
function loadSpot(spot) {
    return {
        type: LOAD_SPOT,
        spot
    }
}
function loadReviews(reviews) {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

export default function spotsReducer(status = {}, action) {
    switch (action.type) {

        case LOAD_SPOTS:
            return { ...status, ...action.spots };
        case LOAD_SPOT:
            return { ...status, ...action.spot };
        case LOAD_REVIEWS:
            return { ...status, ...action.reviews };

        default:
            return status;
    }
}