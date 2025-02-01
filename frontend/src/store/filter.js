// import { csrfFetch } from "./csrf"

const LOAD_FILTERS = "filters/load"

const getSet = (inboundArray) => {
    const resultSet = new Set()
    inboundArray.forEach(v => resultSet.add(v))
    return Array.from(resultSet);
}

export const getFilters = (spots) => async (dispatch) => {
    const filters = {}
    filters.cities = getSet(spots.map(spot => spot.city))
    filters.countries = getSet(spots.map(spot => spot.country))
    dispatch(loadFilters(filters));
    return filters;
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
