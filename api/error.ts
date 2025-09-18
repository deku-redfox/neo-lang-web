interface ErrorProps {
    status: number,
    message: string,
}

export default class APIError implements ErrorProps {
    status: number;
    message: string;

    constructor({ status, message}: ErrorProps) {
        this.status = status
        this.message = message
    }

    getType() : string {
        switch (this.status) {
            case 400:
                return 'Bad Request'
            case 401:
                return 'Unauthenticated'
            case 403:
                return 'Permission Denied'
            case 404:
                return 'Not Found'
            case 500:
                return 'Internal Server Error'
            case -1:
                return 'Unhandled Server Error'
            default:
                return 'Unregistered Error'
        }
    }

    static fromJson(json: any): APIError {
        return new APIError({
            status: json['status'],
            message: json['message']
        });
    }
}