import { csrfFetch } from "./csrf";

const LOAD_MAPS_KEY = "maps/LOAD_KEY";

export const getKey = () => async (dispatch) => {
    const res = await csrfFetch('/api/maps/key', {
        method: "POST"
    })
    const { googleMapsAPIKey: key } = await res.json();
    dispatch(loadKey({key}))
    return res;
}

const loadKey = (key) => {
    return {
        type: LOAD_MAPS_KEY,
        key
    }
}

export default function mapReducer(status = { key: null }, action) {

    switch (action.type) {
        case LOAD_MAPS_KEY:
            return { ...status, ...action.key };

        default:
            return status;
    }
}
