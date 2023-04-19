import Swal from "sweetalert2";
import { getErrorMessage } from "#imports";

export const handleError = (error: unknown) => {
  return Swal.fire(
    'Error!',
    getErrorMessage(error),
    'error'
  )
}
