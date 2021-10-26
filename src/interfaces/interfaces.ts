export interface IDictionary<TValue> {
    [id: string]: TValue;
}

export interface saveProjectPayload {
    name: string,
    text : string[] | null
}