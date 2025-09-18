import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import APIError from "./error"
import APIResponse from "./response"

const DOMAIN = 'https://neo-lang.freelancejob.shop/api'

type Req = {
    url: string,
    options: {
        method: string,
        headers: Headers,
        body: BodyInit | null
    }
}

type ReqOptions = {
    method?: string,
    body?: BodyInit,
    params?: Object,
    cookieStore?: ReadonlyRequestCookies
}

export default class API {
    static _token: string | null;
    
    static async createRequest(route: string, {method = 'GET', body, params, cookieStore} : ReqOptions) : Promise<Req> {
        let headers = new Headers();
        const token = this._getToken(cookieStore)

        // Si cette requete necessite authorisation, alors on aura passe le cookieStore en parametre
        if (token) {
            headers.append('Authorization', `Bearer ${token}`)
        }
        
        if (body) {
            headers.append("Content-Type", "application/json");
        }
        if (params) {
            route = route.concat('?', new URLSearchParams(this.getValidParams(params)).toString())
        }

        return {
            url: `${DOMAIN}${route}`,
            options : {
                method,
                headers,
                body: method != 'GET' ? body! : null,
            }
        };
    }

    static getValidParams(params : Object) {
        let paramsString = ''
        Object.entries(params).forEach(([key, value], i) => {
            if (value && value != 'null') {
                paramsString = paramsString.concat(`${i != 0 ? '&' : ''}${key}=${value}`)
            }
        })
        return paramsString;
    }

    static setToken(token: string, isAdmin: boolean, store: ReadonlyRequestCookies) {
        store.set('token', JSON.stringify({token, isAdmin}))
        this._token = token;
    }
    
    static deleteToken(store: ReadonlyRequestCookies) {
        store.delete('token')
        this._token = null;
    }

    static _getToken(store: ReadonlyRequestCookies | undefined) : string | null {
        if (this._token) return this._token
        const { token } = JSON.parse(store?.get('token')?.value ?? '{}')
        this._token = token
        return this._token
    }

    static jsonReponse = async (req: Req) : Promise<APIResponse | null> => {
        const res = await fetch(req.url, req.options)

        try {
            const json = await res.json()
            if (res.ok) {
                return APIResponse.fromJson(json)

            } else {
                throw APIError.fromJson(json)
            }
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'status' in error) {
                throw error
            }
            throw new APIError({message: 'Cannot Parse JSON', status: -1})
        }
    }
}