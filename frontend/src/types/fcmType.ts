export type NotificationRequest = {
    userId: number;
    title: string;
    body: string;
}
export type NotificationPayload = {
    title: string;
    body: string;
    icon?: string;
};
export type TokenData = {
    token: string;
    userId?: string;
}