// js/findOption.js
import { modulesData } from './data.js';

export function findOptionById(moduleKey, id) {
    const mod = modulesData[moduleKey];
    if (!mod) return null;
    let result = null;
    (function recurse(list) {
        for (const item of list) {
            if (item.type === 'final' && item.id === id) { result = item; return; }
            if (item.children) { recurse(item.children); if (result) return; }
        }
    })(mod.categories);
    return result;
}
