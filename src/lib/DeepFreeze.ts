
/**
 * Freeze the object deeply so it cannot be changed.
 * @param obj The object that needs to be freezed
 */
export const deepFreeze = (obj: object) => {
    let names: string[] = Object.getOwnPropertyNames(obj);

    for (let i = names.length - 1; i >= 0; --i) {
        let prop: object = obj[names[i]];
        if (prop != null && typeof prop == 'object') deepFreeze(prop);
    }

    return Object.freeze(obj);
}