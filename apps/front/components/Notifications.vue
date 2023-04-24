<script lang="ts" setup>
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import {computed, useNotifications} from '#imports'
import {InjectedNotification} from "~/intefaces/InjectedNotification";

const notificationsStore = useNotifications()

function close(index: number): void {
    notificationsStore.value.notifications.splice(index, index + 1)
}

const notifications = computed<InjectedNotification[]>(() => {
    return notificationsStore.value.notifications;
})
</script>

<style scoped></style>


<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div aria-live="assertive" class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 sm:items-start items-end">
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition
        v-for="(notification, index) in notifications"
        :key="notification.id"
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="notification.text"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <XCircleIcon v-if="notification.type === 'error'" aria-hidden="true" class="h-5 w-5 text-red-400" />
                <ExclamationTriangleIcon
                  v-else-if="notification.type === 'warning'"
                  aria-hidden="true"
                  class="h-5 w-5 text-yellow-400"
                />
                <CheckCircleIcon v-else aria-hidden="true" class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                <p class="mt-1 text-sm text-gray-500" v-text="notification.text" />
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                  @click="close(index)"
                >
                  <span class="sr-only">Close</span>
                  <XCircleIcon aria-hidden="true" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

