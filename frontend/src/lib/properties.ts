import {
  properties as apiProperties,
  neighbourhood,
  saved,
  preferences,
  hero,
  landlords,
  notifications,
  type Property as VerifiedProperty,
  type SubmitPropertyData,
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_ICON,
  getImageUrl
} from "./api";

export {
  apiProperties as properties,
  neighbourhood,
  saved,
  preferences,
  hero,
  landlords,
  notifications,
  type VerifiedProperty,
  type SubmitPropertyData,
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_ICON,
  getImageUrl,
};

export const fetchVerifiedProperties = apiProperties.list;
export const fetchPropertyById = apiProperties.get;
export const submitProperty = apiProperties.submit;
export const fetchNeighbourhoodData = neighbourhood.get;
export const fetchLandlordProperties = apiProperties.listByLandlord;
