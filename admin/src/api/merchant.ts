import axios from "axios";
import { apiUrl } from "./common/Config";
import { CreateMerchantRequest, EditMerchantRequest } from "./types";
import { post } from "./common/RequestHelper";

const baseUrl = apiUrl + "merchants/";

export const createMerchant = async (
  request: CreateMerchantRequest
): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const formData = new FormData();
  formData.append("name", request.name);
  formData.append("imageKey", request.imageKey);
  formData.append("contactName", request.contactName ?? "");
  formData.append("contactEmail", request.contactEmail ?? "");
  formData.append("contactPhone", request.contactPhone ?? "");
  formData.append("color", request.color ?? "");

  const res = await axios.post(baseUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + jwtToken,
    },
  });

  return res.data;
};

export const updateMerchant = async (
  request: EditMerchantRequest
): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const response = await post(baseUrl + "updateMerchant", request, jwtToken);
  return response.data;
};

export const editMerchant = async (
  request: EditMerchantRequest
): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const formData = new FormData();
  formData.append("id", request.id.toString());
  formData.append("name", request.name);
  formData.append("imageKey", request.imageKey);
  formData.append("contactName", request.contactName ?? "");
  formData.append("contactEmail", request.contactEmail ?? "");
  formData.append("contactPhone", request.contactPhone ?? "");
  formData.append("color", request.color ?? "");
  const res = await axios.post(baseUrl + "edit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + jwtToken,
    },
  });

  return res.data;
};
