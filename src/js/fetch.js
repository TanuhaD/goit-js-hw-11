import axios from "axios";
import { PER_PAGE } from "./params.js";
import * as dotenv from "dotenv";
dotenv.config();
const BASE_URL = "https://pixabay.com/api/";
const PARAMS = {
  key: process.env.PIXABAY_KEY,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: PER_PAGE,
};
const fetchPixabay = axios.create({
  baseURL: BASE_URL,
});

export function fetchPictures(q, page) {
  return fetchPixabay
    .get("", { params: { ...PARAMS, q, page } })
    .then(({ data }) => data);
}
