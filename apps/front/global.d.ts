import 'jest-extended';

// https://stackoverflow.com/a/59499895/6277151
import {GoogleLoginCallbackPayload} from "~/intefaces/GoogleLoginCallbackPayload";

export {}

declare global {
    interface Window {
        __NUXT__: any
        googleLoginCallback: (payloadClient: GoogleLoginCallbackPayload) => void
    }
}
