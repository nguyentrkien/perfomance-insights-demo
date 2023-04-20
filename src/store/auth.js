import axios from 'axios';
import  { loginSuccess, logoutSuccess } from 'store';


export const loginUser = async (user, history, dispatch) => {
    try {
        const {data: {data}} = await axios.post("http://localhost:4000/auth/login", user);
        dispatch(loginSuccess(data))
        history.push("/admin")
    }
    catch(err) {
        return (err.response.data.message)
    }
}

export const resgisterUser = async (user, history) => {
    try {
        await axios.post("http://localhost:4000/auth/register", user);
        history.push("/login")
    }
    catch(err) {
        return (err.response.data.message)
    }
}

export const logoutUser = async (history, dispatch) => {
    try {
        await dispatch(logoutSuccess())
        history.push("/login")
    }
    catch(err) {
        return (err)
    }
}


