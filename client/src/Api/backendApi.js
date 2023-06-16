import axios from "axios";

export const BackendApi = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data, headers) {
      headers["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
      return data;
    },
    ...axios.defaults.transformRequest,
  ],
});
