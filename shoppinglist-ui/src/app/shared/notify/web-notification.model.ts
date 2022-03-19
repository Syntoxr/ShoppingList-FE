 
export enum NotificationLevels {
    Info = 'info',
    Success = 'success',
    Warn = 'warn',
    Error = 'error',
}


export class WebNotification {

    constructor(
        public title: string,
        public message?: string,
        public level?: NotificationLevels,
        public duration: number = 7000 //duration im ms
        ) {}
}