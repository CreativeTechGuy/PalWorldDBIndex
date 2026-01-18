export function getObjectByCaseInsensitiveKey<Value>(obj: Record<string, Value>, key: string): Value | undefined {
    const entries = Object.entries(obj);
    for (const [entryKey, value] of entries) {
        if (entryKey.toLowerCase() === key.toLowerCase()) {
            return value;
        }
    }
    return undefined;
}
