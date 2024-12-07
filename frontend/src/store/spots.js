import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/load';

export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const data = await res.json();
    dispatch(loadSpots(data))
    return res;
}

function loadSpots(spots) {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

export default function spotsReducer(status = {}, action) {
    switch (action.type) {

        case LOAD_SPOTS:
            return { ...status, ...action.spots };

        default:
            return status;
    }
}