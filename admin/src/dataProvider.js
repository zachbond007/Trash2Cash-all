import axios from "axios";
import { apiUrl } from "./api/common/Config";

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const dataProvider = (type, resource, params) => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")).data.jwtToken;
  headers.Authorization = "Bearer " + jwtToken;

  switch (type) {
    case "GET_LIST": {
      return axios
        .get(`${apiUrl}${resource}`, { headers, params })
        .then(({ data }) => ({
          data: data.data,
          total: data.length,
        }));
    }
    case "GET_ONE": {
      return axios
        .get(`${apiUrl}${resource}/${params.id}`, { headers })
        .then(({ data }) => ({
          data,
        }));
    }
    case "GET_MANY": {
      const id = params.ids.join(",");
      return axios
        .get(`${apiUrl}${resource}?id=${id}`, { headers })
        .then(({ data }) => ({
          data,
        }));
    }
    case "GET_MANY_REFERENCE": {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      return axios
        .get(
          `${apiUrl}${resource}?sort=${field}&order=${order}&page=${page}&per_page=${perPage}`,
          { headers }
        )
        .then(({ data }) => ({
          data,
          total: data.length,
        }));
    }
    case "CREATE":
      return axios
        .post(`${apiUrl}${resource}`, params.data, { headers })
        .then(({ data }) => ({
          data,
        }));
    case "UPDATE": {
      return axios
        .put(`${apiUrl}${resource}/${params.id}`, params.data, { headers })
        .then(({ data }) => ({
          data,
        }));
    }
    case "DELETE":
    case "DELETE_MANY":
      let ids;
      if (type === "DELETE") {
        ids = params.id;
      } else {
        ids = params.ids.join(",");
      }
      return axios
        .post(`${apiUrl}${resource}/delete?id=${ids}`, { id: ids }, { headers })
        .then(({ data }) => ({
          data,
        }));
    default:
      throw new Error(`Unsupported Data Provider request type ${type}`);
  }
};
