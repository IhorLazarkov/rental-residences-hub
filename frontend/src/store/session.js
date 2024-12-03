import { csrfFetch } from "./csrf"

const initState = { user: null }
//Login
const CREATE_SESSION = "session/CREATE_SESSION"
//Logout
const DELETE_SESSION = "session/DELETE_SESSION"

//action creators
export const login = (user) => async function (dispatch) {
    const { credential, password } = user
    try {

        const res = await csrfFetch('/api/session', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                credential,
                password
            })
        })
        if (res.ok) {
            const user = await res.json()
            dispatch(setUser(user));
            return res.body
        }
        else {
            console.error("error occurred on login", await res.json().message);
            dispatch(removeUser());
        }
    } catch (error) {
        console.error(error);
    }
}

function setUser(user) {
    return {
        type: CREATE_SESSION,
        user
    }
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