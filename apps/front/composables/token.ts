export const useToken = () => {
  return useCookie<string>("api-token");
};
