import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatStore } from '../store/useChatStore'
import { getStateInstance} from '../api/greenApi'
import { Toast } from '../components/Toast'
import type { InstanceResponse } from '../types/instance'

export function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [idInstance, setIdInstance] = useState('')
    const [apiToken, setApiToken] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const setCredentials = useChatStore((s) => s.setCredentials)

    //Отправка формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        checkToken().then((result: InstanceResponse) => {
            console.log("result",result)
            if (!result.ok) {
                setError(result.error ?? 'Не удалось проверить данные');
                return;
            }

            // Если state не authorized — тоже ошибка
            if (result.state !== 'authorized') {
                setError(`Инстанс в состоянии: ${result.state}. Авторизуйте его в личном кабинете.`);
                return;
            }

            // Всё ок
            setCredentials({ idInstance, apiToken });
            navigate('/chat');
        }).catch((error: InstanceResponse) => {
            //Ошибка, уведомим
            console.error("error", error);
            setError(error.error!); // )

        }).finally(()=>{
            setLoading(false);
        })
    }

    //Проверка данных
    function checkToken(): Promise<InstanceResponse> {
        return getStateInstance(idInstance, apiToken);
    }

    //Скроем тоаст
    useEffect(() => {
        if (!error) return
        const timer = setTimeout(() => setError(null), 5000)
        return () => clearTimeout(timer)
    }, [error])

    return (
        <div className="flex-1 flex items-center justify-center p-8">
            {error && <Toast message={error} onClose={() => setError(null)} />}
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Вход</h1>
                <p className="text-sm text-gray-500 mb-4">
                    Введите данные из личного кабинета GREEN-API
                </p>

                <input
                    type="text"
                    value={idInstance}
                    onChange={(e) => setIdInstance(e.target.value)}
                    placeholder="idInstance"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                     text-gray-800 placeholder:text-gray-400
                     focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                     transition"
                />
                <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="apiTokenInstance"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200
                     text-gray-800 placeholder:text-gray-400
                     focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                     transition"
                />

                <button
                    type="submit"
                    disabled={loading || !idInstance.trim() || !apiToken.trim()}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium
                    hover:bg-emerald-600 active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 disabled:active:scale-100
                    transition cursor-pointer"
                >
                    {loading ? 'Проверка...' : 'Войти'}
                </button>
            </form>
        </div>
    )
}
