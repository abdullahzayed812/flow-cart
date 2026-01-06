import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const log = `[${new Date().toISOString()}] ${method} ${url} ${status} - ${duration}ms`;

        if (status >= 400) {
            console.error(log);
        } else {
            console.log(log);
        }
    });

    next();
};
