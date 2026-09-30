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