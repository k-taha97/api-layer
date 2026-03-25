import axios from 'axios'

export const commonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Content-Security-Policy': 'connect-src *',
}

export const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    // if (err?.response?.status === 401) {
    //   window.location.replace('/')
    //   localStorage.clear()
    // }

    throw err
  },
)

axiosInstance.interceptors.request.use((request) => {
  return request
})
