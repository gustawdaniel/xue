import Swal from "sweetalert2";
import { getErrorMessage } from "~/composables/getErrorMessage";

export const handleError = (error: unknown) => {
  return Swal.fire("Error!", getErrorMessage(error), "error");
};
