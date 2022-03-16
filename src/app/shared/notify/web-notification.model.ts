 
export enum NotificationLevels {
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
}


export class WebNotification {

    constructor(
        public title: string,
        public description?: string,
        public level?: NotificationLevels,
        public duration: number = 7000 //duration im ms
        ) {}
}