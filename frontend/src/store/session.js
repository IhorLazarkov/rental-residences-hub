import { csrfFetch } from "./csrf"

const initState = { user: null }
//Login
const CREATE_SESSION = "session/CREATE_SESSION"
//Logout
const DELETE_SESSION = "session/DELETE_SESSION"

//action creators
export const login = (user) => async function (dispatch) {
    const { credential, password } = user
    const res = await csrfFetch('/api/session', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            credential,
            password
        })
    }).catch(async err => {
        const data = await err.text();
        const { message, errors } = JSON.parse(data)
        console.log({ message, errors });
        return { ok: err.ok, status: err.status, message, errors };
    });
    if (res.ok) {
        const data = await res.json()
        dispatch(setUser(data));
    }
    return res;
}
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data));
    return response;
};

function setUser(user) {
    return {
        type: CREATE_SESSION,
        user
    }
}

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user
    const res = await csrfFetch('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    })
    const data = await res.json()
    dispatch(setUser(data))
    return res;
}

export const logout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session', {
        method: "DELETE"
    })
    dispatch(removeUser())
    return res;
}

function removeUser() {
    return {
        type: DELETE_SESSION,
        user: initState
    }
}

//The Reducer
export default function sessionActions(state = initState, action) {
    switch (action.type) {
        case CREATE_SESSION:
            return { ...state, ...action.user };
        case DELETE_SESSION:
            return { ...action.user, initState }
        default:
            return state;
    }
}