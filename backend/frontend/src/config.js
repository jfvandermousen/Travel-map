import axios from "axios"


export const axiosInstance = axios.create(
    {
        baseURL: "https://pin-travel-map.herokuapp.com/api",
    }
)