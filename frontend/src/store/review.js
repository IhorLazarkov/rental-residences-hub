import { csrfFetch } from "./csrf"

const LOAD_REVEIWS = "reviews/load"

export const getReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await res.json();
    dispatch(loadReviews(data))
    return res;
}

export const createReview = ({ spotId, stars, review }) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars })
    }).catch(async err => {
        const data = await err.text();
        const { message, errors } = JSON.parse(data)
        console.log({ message, errors });
        return { ok: err.ok, status: err.status, message, errors };
    });
    await dispatch(getReviews(spotId));
    return res;
}

export const getCurrentReviews = () => async (dispatch) => {
    const res = await csrfFetch('/api/reviews/current')
        .catch(async err => {
            const data = await err.text();
            const { message, errors } = JSON.parse(data)
            return { ok: err.ok, status: err.status, message, errors };
        })
    const data = await res.json()
    dispatch(loadReviews(data))
    return res;
}

export const updateReview = ({ reviewId, review, stars }) => async () => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, stars, review })
    }).catch(async err => {
        const data = await err.text();
        const { message, errors } = JSON.parse(data)
        return { ok: err.ok, status: err.status, message, errors };
    });
    return res;
};


export const deleteReview = ({ reviewId }) => async () => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    }).catch(async err => {
        const data = await err.text();
        const { message, errors } = JSON.parse(data)
        return { ok: err.ok, status: err.status, message, errors };
    });
    return res;
}

function loadReviews(reviews) {
    return {
        type: LOAD_REVEIWS,
        reviews
    }
}

export default function reviewReducer(status = {}, action) {
    switch (action.type) {
        case LOAD_REVEIWS:
            status = { ...action.reviews }
            return { ...status }
        default:
            return status;
    }
}