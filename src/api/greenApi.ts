import axios, { AxiosError } from 'axios'

const API_URL = '/api'  //Это только для дев


export type InstanceState =
    | 'authorized'
    | 'notAuthorized'
    | 'blocked'
    | 'starting'
    | 'suspended'
    | 'pendingPassword'
    | null

export type InstanceResponse = {
    ok: boolean;
    state: InstanceState;
    error?: string
}

export async function getStateInstance(
    idInstance: string,
    apiToken: string,
): Promise<InstanceResponse> {
    const url = `${API_URL}/waInstance${idInstance}/getStateInstance/${apiToken}`

    return new Promise((resolve, reject) => {
        axios.get<{ stateInstance: InstanceState }>(url).then(response => {
            resolve({ ok: true, state: response.data.stateInstance })
        }).catch(err => {
            const error = err as AxiosError
            if (error.response?.status === 401) {
                reject({ ok: false, state: null, error: 'Неверный apiTokenInstance' })
            }
            if (error.response?.status === 403) {
                reject({ ok: false, state: null, error: 'Неверный idInstance' })
            }
            if (error.response?.status === 404) {
                reject({ ok: false, state: null, error: 'Инстанс не найден' })
            }

            reject({ ok: false, state: null, error: 'Ошибка соединения с GREEN-API' })
        })
    })
}