export class ApiResponse<T = any> {
    constructor(
        public success: boolean,
        public data?: T,
        public error?: {
            code: string;
            message: string;
            details?: any;
        },
        public meta?: {
            page?: number;
            limit?: number;
            total?: number;
            total_pages?: number;
        }
    ) { }

    static success<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(true, data);
    }

    static error(message: string, code: string = 'ERROR', details?: any): ApiResponse<null> {
        return new ApiResponse(false, null, { code, message, details });
    }
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
