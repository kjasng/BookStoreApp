import { axiosInstance as axios } from "@/utils/axios-customize";

interface UpdateUser {
    _id: string;
    fullName: string;
    phone: number;
}

interface AddNewUser {
    fullName: string;
    email: string;
    phone: number;
}
export const callRequest = async (
    fullName: string,
    email: string,
    password: string,
    phone: number,
) => {
    return axios.post("/api/v1/user/register", {
        fullName,
        email,
        password,
        phone,
    });
};

export const loginRequest = async (username: string, password: string) => {
    return axios.post("api/v1/auth/login", { username, password });
};

export const logoutRequest = async () => {
    return axios.post("api/v1/auth/logout");
};

export const callFetchAccount = async () => {
    return axios.get("api/v1/auth/account");
};

export const getUser = async (current: number, pageSize: number) => {
    return axios.get(`/api/v1/user?current=${current}&pageSize=${pageSize}`);
};

export const searchUser = async (
    current: number,
    pageSize: number,
    params: string,
) => {
    return axios.get(
        `/api/v1/user?current=${current}&pageSize=${pageSize}&${params}`,
    );
};

export const deleteUser = async (id: string) => {
    return axios.delete(`/api/v1/user/${id}`);
};

export const updateUser = async (id: string, data: UpdateUser) => {
    return axios.put(`/api/v1/user/`, {
        ...data,
        _id: id,
    });
};

export const AddNewUserApi = async (data: AddNewUser) => {
    return axios.post("/api/v1/user", data);
};

export const getBookList = async (current: number, pageSize: number) => {
    return axios.get(`api/v1/book?current=${current}&pageSize=${pageSize}`);
};

export const searchBook = async (
    current: number,
    pageSize: number,
    value: string,
) => {
    return axios.get(
        `api/v1/book?current=${current}&pageSize=${pageSize}&${value}`,
    );
};
