import { csrfFetch } from "./csrf"

const initState = { user: null }
//Login
const CREATE_SESSION = "session/CREATE_SESSION"
//Logout
const DELETE_SESSION = "session/DELETE_SESSION"

//action creators
export const login = (user = {}) => async function (dispatch) {
    const res = await csrfFetch('/api/session', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            credential: user?.name,
            password: user?.password
        })
    })
    if (res.ok) {
        const user = await res.json()
        dispatch(loginCallback(user));
        return res.body
    }
    else {
        console.error("error occurred on login", await res.json().message);
        dispatch();
    }
}

function loginCallback(user) {
    return {
        type: CREATE_SESSION,
        user
    }
}

function logout() {
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
            return { ...action.user }
        default:
            return state;
    }
}