import { csrfFetch } from "./csrf"

const LOAD_REVEIWS = "reviews/load"


export const getReviews = () => async (dispatch) => {
    const res = await csrfFetch("/api/reviews/current")
    const data = await res.json()
    dispatch(loadReviews(data))
    return res;
}

export const createReview = ({ spotId, stars, review }) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars })
    });
    const data = await res.json();
    dispatch(loadReviews(data));
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