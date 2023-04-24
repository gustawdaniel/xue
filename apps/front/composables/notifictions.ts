import dayjs from 'dayjs'
import { useState } from '#imports'
import {InjectedNotification, NotificationBaseOptions, NotificationType} from "~/intefaces/InjectedNotification";



// export function useNotifications() {
//     const notifications = ref<InjectedNotification[]>([])
//
//     function notify(notification: Notification) {
//         const id = dayjs().unix();
//
//         const n: InjectedNotification = {
//             ...notification,
//             id
//         }
//
//         setTimeout(() => {
//             const index = notifications.value.findIndex(n => n.id === id)
//             if (index >= 0) {
//                 notifications.value.splice(index, 1)
//             }
//         }, 3000)
//
//         notifications.value.push(n)
//     }
//
//     return {
//         notifications,
//         notify
//     }
// }

class Notification {
  title: string
  text: string
  timeout: number = 3000
  type: NotificationType = 'success'

  constructor(options: NotificationBaseOptions) {
    this.title = options.title ?? 'notification'
    this.text = options.text ?? ''
    if ('timeout' in options) {
      this.timeout = options.timeout ?? 3000
    }
    if ('type' in options) {
      this.type = options.type ?? 'success'
    }
  }

  toJson(): NotificationBaseOptions {
    return {
      title: this.title,
      text: this.text,
      timeout: this.timeout,
      type: this.type,
    }
  }
}

export function useNotifications() {
  return useState<{
    notifications: InjectedNotification[]
  }>('notifications', () => ({
    notifications: [],
  }))
}

export function notify(notificationOptions: NotificationBaseOptions) {
  const id = dayjs().unix()

  const state = useNotifications()

  const notification = new Notification(notificationOptions)

  const n: InjectedNotification = {
    ...notification.toJson(),
    id,
  }

  if (Number.isFinite(notification.timeout)) {
    setTimeout(() => {
      const index = state.value.notifications.findIndex((n) => n.id === id)
      if (index >= 0) {
        state.value.notifications.splice(index, 1)
      }
    }, 3000)
  }

  state.value.notifications.push(n)
}
