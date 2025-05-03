import { AxiosResponse } from "axios";
import { Response } from "../types/responses";

export function checkResponseSuccess<T>(
    response: AxiosResponse<Response<T>>
) {
    if(response.status >= 200 && response.status < 300) {
        return response.data.data;
    }
    throw new Error(response.data.message);
}