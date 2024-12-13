import { csrfFetch } from "./csrf"

const LOAD_REVEIWS = "reviews/load"

export const getReviews = () => async (dispatch) => {
    const res = await csrfFetch("/api/reviews/current")
    const dataReviews = await res.json()
    dispatch(loadReviews(dataReviews))
    return res;
}

function loadReviews(reviews) {
    return {
        type: LOAD_REVEIWS,
        reviews
    }
}

export default function reviewReducer(status = {}, action) {
    switch (action.key) {
        case LOAD_REVEIWS:
            return { ...status, ...action.reviews }
        default:
            return status;
    }
}