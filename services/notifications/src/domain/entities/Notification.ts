import { NotificationType } from '../../../../shared/types/enums';

export class Notification {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public type: NotificationType,
        public title: string,
        public message: string,
        public data: Record<string, any> | null,
        public isRead: boolean,
        public readAt: Date | null,
        public readonly createdAt: Date
    ) { }

    static create(
        id: string,
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        data: Record<string, any> | null = null
    ): Notification {
        return new Notification(
            id,
            userId,
            type,
            title,
            message,
            data,
            false,
            null,
            new Date()
        );
    }

    markAsRead(): void {
        this.isRead = true;
        this.readAt = new Date();
    }
}
