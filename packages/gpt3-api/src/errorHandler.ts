import { AxiosError } from "axios";

export function logAxiosErrorToConsole(error: AxiosError) {
  console.log("ZZ > req", error.request.headers, error.request.url, error.request.method, error.request.data);
  console.log("ZZ > res", error.response?.status, error.response?.data, error.response?.headers);
}

export function errorHandler(error: unknown) {
  if (error instanceof AxiosError) {
    logAxiosErrorToConsole(error);
  } else {
    console.log("XX", error);
  }
}

