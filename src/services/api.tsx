import { axiosInstance as axios } from "@/utils/axios-customize";

export const callRequest = async (fullName: string, email: string, password: string, phone: number) => {
    return axios.post("/api/v1/user/register", { fullName, email, password, phone });
};

export const loginRequest = async(username: string, password: string) => {
    return axios.post("api/v1/auth/login", { username, password });
};

export const callFetchAccount = async() => {
    return axios.get("api/v1/auth/account")
}
