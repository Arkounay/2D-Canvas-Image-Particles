/**
 * Merge properties between two objects
 * @param obj1
 * @param obj2
 * @returns {}
 */
export function mergeObjects(obj1, obj2) {
    var obj3 = {};
    for (var key in obj1) {
        obj3[key] = obj1[key];
    }
    for (var key in obj2) {
        obj3[key] = obj2[key];
    }
    return obj3;
}
