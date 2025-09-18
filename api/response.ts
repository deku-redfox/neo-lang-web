interface ResponseProps {
    status: number,
    message: string,
    data: any
}

export default class APIResponse implements ResponseProps {
    status: number;
    message: string;
    data: any;

    constructor({ status, message, data }: ResponseProps) {
        this.status = status
        this.message = message
        this.data = data
    }

    static fromJson(json: any): APIResponse {
        return new APIResponse({
            status: json['status'],
            message: json['message'],
            data: json['data'],
        });
    }
}