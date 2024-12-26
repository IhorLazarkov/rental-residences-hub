import { csrfFetch } from "./csrf"

const LOAD_FILTERS = "filters/load"

const getSet = (inboundArray) => {
    const resultSet = new Set()
    inboundArray.forEach(v => resultSet.add(v))
    return Array.from(resultSet);
}

export const getFilters = () => async (dispatch) => {
    const filters = {}
    const res = await csrfFetch('/api/spots')
    const data = await res.json()
    filters.cities = getSet(data.Spots.map(spot => spot.city))
    filters.countries = getSet(data.Spots.map(spot => spot.country))
    dispatch(loadFilters(filters));
    return res;
}

const loadFilters = (filters) => {
    return {
        type: LOAD_FILTERS,
        filters
    }
}

export default function filterReducer(status = {}, action) {

    switch (action.type) {
        case LOAD_FILTERS:
            return { ...status, ...action.filters }
        default:
            return status;
    }

}
