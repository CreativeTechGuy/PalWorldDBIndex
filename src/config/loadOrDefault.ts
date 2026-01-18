export function loadOrDefault<Value>(localStorageKey: string, defaultValue: Value): Value {
    const storage = localStorage.getItem(localStorageKey);
    if (storage === null) {
        return defaultValue;
    }
    if (Array.isArray(defaultValue)) {
        const newArray = JSON.parse(storage) as Value;
        if (Array.isArray(newArray)) {
            return newArray;
        }
        return defaultValue;
    }
    if (typeof defaultValue === "object") {
        return {
            ...defaultValue,
            ...(JSON.parse(storage) as Value),
        };
    }
    if (typeof defaultValue === "number") {
        return parseFloat(storage) as Value;
    }
    return storage as Value;
}
