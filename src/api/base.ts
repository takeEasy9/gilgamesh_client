import Request from '@/utils/request';

const baseUrl = {
  gilgamesh: import.meta.env.VITE_GILGAMESH_API_BASE_URL,
} as const;

const gilgameshRequest = new Request({});
export {
  baseUrl,
  gilgameshRequest,
};
