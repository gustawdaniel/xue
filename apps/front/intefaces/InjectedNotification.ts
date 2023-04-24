export type NotificationType = 'error' | 'warning' | 'success'

export interface NotificationBaseOptions {
    title: string
    text: string
    timeout?: number
    type?: NotificationType
}

export interface InjectedNotification extends NotificationBaseOptions {
    id: number
}
