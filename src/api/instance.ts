import axios from 'axios'
import { API_BASE_URL } from './endpoints'
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default API
