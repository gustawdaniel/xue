<script lang="ts" setup>
import {handleError, setDefaultCourse, useRouter, useToken, useUser} from "#imports";
import { GoogleLoginCallbackPayload } from "~/intefaces/GoogleLoginCallbackPayload";

useHead({
  script: [
    {
      async: true,
      src: "https://accounts.google.com/gsi/client",
      defer: true,
    },
  ],
});

const config = useRuntimeConfig();
const router = useRouter();
import { t } from "#imports";

console.log(1);
if (process.client) {
  console.log(2);
  window.googleLoginCallback = (userData: GoogleLoginCallbackPayload) => {
    console.log("ud", userData);

    t.googleVerify
      .mutate({ credential: userData.credential })
      .then(async (res) => {
        const token = useToken();
        const user = useUser();

        console.log("pl", res);
        token.value = res.token;
        console.log("token", token.value);
        user.value = res.user;

        await setDefaultCourse()

        return router.push("/");
      })
      .catch((error) => handleError(error));
  };
}
</script>

<template>
  <div>
    <div
      id="g_id_onload"
      :data-client_id="config.public.googleClientId"
      data-callback="googleLoginCallback"
      data-context="signin"
      data-ux_mode="popup"
      data-auto_select="true"
      data-itp_support="true"
    ></div>

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="outline"
      data-text="continue_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<style scoped></style>
