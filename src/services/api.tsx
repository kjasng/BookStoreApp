import { axiosInstance as axios } from "@/utils/axios-customize"

interface UpdateUser {
  _id: string
  fullName: string
  phone: number
}

interface AddNewUser {
  fullName: string
  email: string
  phone: number
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
  })
}

export const loginRequest = async (username: string, password: string) => {
  return axios.post("api/v1/auth/login", { username, password })
}

export const logoutRequest = async () => {
  return axios.post("api/v1/auth/logout")
}

export const callFetchAccount = async () => {
  return axios.get("api/v1/auth/account")
}

export const getUser = async (current: number, pageSize: number) => {
  return axios.get(`/api/v1/user?current=${current}&pageSize=${pageSize}`)
}

export const searchUser = async (
  current: number,
  pageSize: number,
  params: string,
) => {
  return axios.get(
    `/api/v1/user?current=${current}&pageSize=${pageSize}&${params}`,
  )
}

export const deleteUser = async (id: string) => {
  return axios.delete(`/api/v1/user/${id}`)
}

export const updateUser = async (id: string, data: UpdateUser) => {
  return axios.put(`/api/v1/user/`, {
    ...data,
    _id: id,
  })
}

export const AddNewUserApi = async (data: AddNewUser) => {
  return axios.post("/api/v1/user", data)
}

export const getBookList = async (
  current: number,
  pageSize: number,
  sorter: string,
) => {
  return axios.get(
    `api/v1/book?current=${current}&pageSize=${pageSize}${sorter}`,
  )
}

export const searchBook = async (
  current: number,
  pageSize: number,
  value: string,
) => {
  return axios.get(
    `api/v1/book?current=${current}&pageSize=${pageSize}&${value}`,
  )
}

export const callFetchCategory = async () => {
  return axios.get("/api/v1/database/category")
}

export const callUploadBookImg = (fileImg: File) => {
  const bodyFormData = new FormData()
  bodyFormData.append("fileImg", fileImg)
  return axios({
    method: "POST",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  })
}

export const addNewBook = async (
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  sold: number,
  quantity: number,
  category: string,
) => {
  return axios.post("/api/v1/book", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  })
}

export const updateBook = async (
  id: string,
  mainText: string,
  author: string,
  price: number,
  sold: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[],
) => {
  return axios.put(`/api/v1/book/${id}`, {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
  })
}

export const deleteBook = async (id: string) => {
  return axios.delete(`/api/v1/book/${id}`)
}

export const loadBookHome = async (current: number, pageSize: number, sort: string) => {
  return axios.get(`/api/v1/book?current=${current}&pageSize=${pageSize}&${sort}`)
}

export const getAllBook = async () => {
  return axios.get("/api/v1/book")
}

