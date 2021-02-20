export const isItemChanged = (data1, data2, keys) => {
    for (const key of keys) {
        const value1 = data1[key];
        const value2 = data2[key];
        if (Array.isArray(value1) && Array.isArray(value2)) {
            if (JSON.stringify(value1.sort()) !== JSON.stringify(value2.sort())) {
                return true;
            }
        } else if (value1 !== value2) {
            return true;
        }
    }

    return false;
}

export const getSelectedValues = (data, keys) => {
    let result = {};
    for (let key of keys)
        result[key] = data[key];

    return result;
}

export const validateItem = (data, specification) => {
    // exampleSpecification = {
    //     name: {title: 'Name', check: ['notEmpty', 'min3', 'max5']},
    //     description: {title: 'Description', check: ['max5']}
    // };
    let message = '';
    for (let key in specification) {
        if (specification.hasOwnProperty(key)) {
            let spec = specification[key];
            let title = spec['title'];
            let check = spec['check'];
            for (const validation of check) {
                if (validation === 'notEmpty' && (!data.hasOwnProperty(key) || data[key] == null || data[key].length === 0))
                    message += `${title} can not be empty! `;

                if (data.hasOwnProperty(key) && data[key] != null) {
                    if (validation.includes('min')) {
                        let min = parseInt(validation.substring(3));
                        if (data[key].length < min)
                            message += `${title} must be at least ${min} characters long! `;
                    }

                    if (validation.includes('max')) {
                        let max = parseInt(validation.substring(3));
                        if (data[key].length > max)
                            message += `${title} can be up to ${max} characters long! `;
                    }
                }
            }
        }
    }

    if (message.length > 0)
        return message;
    else return null;
}

/*
    Resolves problem with MaterialTable warning:
    Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
    Example:
    resolve({
        data: convertNullValuesInCollection(result.data, {description: '', bucketsIds: []}}),
        page: result.page,
        totalCount: result.total,
    })
 */
export const convertNullValuesInCollection = (inputCollection, mappers) => {
    inputCollection.forEach(function (item) {
        for (let key in mappers) {
            if (mappers.hasOwnProperty(key))
                if (item[key] == null)
                    item[key] = mappers[key];
        }
    });

    return inputCollection;
}

export const convertNullValuesInObject = (inputObject, mappers) => {
    for (let key in mappers) {
        if (mappers.hasOwnProperty(key))
            if (inputObject[key] == null)
                inputObject[key] = mappers[key];
    }
    return inputObject;
}

export const getIdsStr = (inputIdsArray) => {
    if (inputIdsArray != null && inputIdsArray.length > 0) {
        let ids = JSON.parse(JSON.stringify(inputIdsArray));
        const length = ids.length;
        if (length > 4)
            return `${ids.splice(0, 3).join(', ')}...[${length}]`;
        else
            return ids.join(`, `);
    } else
        return '';
}

export const getArrayLengthStr = (inputIdsArray) => {
    if (inputIdsArray != null && inputIdsArray.length > 0)
        return `[${inputIdsArray.length}]`;
    else
        return '[0]';
}

export const setSelectionItemById = (inputItems, itemId) => {
    let items = JSON.parse(JSON.stringify(inputItems));

    if (itemId > 0)
        for (let item of items)
            if (item.id === itemId) {
                item['tableData'] = {};
                item['tableData']['checked'] = true;
            }

    return items;
}

export const setSelectionItemsByIds = (inputItems, itemsIds) => {
    let items = JSON.parse(JSON.stringify(inputItems));

    if (itemsIds != null && itemsIds.length > 0)
        for (let item of items)
            if (itemsIds.indexOf(item.id) > -1) {
                item['tableData'] = {};
                item['tableData']['checked'] = true;
            }

    return items;
}

export const getRolesNames = (roles, rolesIds) => {
    if (roles != null && rolesIds != null && rolesIds.length > 0 && roles.length > 0) {
        let rolesStr = '';
        for (let roleId of rolesIds) {
            let filteredRoles = roles.filter(r => r.id === roleId);
            if (filteredRoles.length > 0)
                rolesStr += ` ${filteredRoles[0].name.substring(0, 1)}`;
            else
                rolesStr += " ?";
        }
        return rolesStr;
    } else
        return '';
}

export const sortByKey = (array, key) => {
    return array.sort(function (a, b) {
        const x = a[key];
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


export const notifierChangeAdapter = (items, payload) => {
    const fieldName = payload.itemsTargetFieldName;
    const sourceObjId = payload.sourceObjectId;
    const sourceObjItemsIds = payload.sourceObjectItemsIds;

    return items.map(item => {
        if (sourceObjItemsIds != null && sourceObjItemsIds.includes(item.id)) {
            // make sure this item is in the array
            if (item[fieldName] == null) {
                item[fieldName] = [];
                item[fieldName].push(sourceObjId);
            } else if (!item[fieldName].includes(sourceObjId))
                item[fieldName].push(sourceObjId);
        } else {
            // make sure this item is not in the array
            if (item[fieldName] != null && item[fieldName].includes(sourceObjId))
                item[fieldName] = item[fieldName].filter(id => id !== sourceObjId);
        }
        return item;
    });
}

export const arraysEquals = (newData, oldData, fieldName) => {
    const newArray = newData[fieldName];
    const oldArray = oldData[fieldName];

    if (newArray == null || oldArray == null)
        return newArray === oldArray;
    else
        return JSON.stringify(newArray.sort()) === JSON.stringify(oldArray.sort());
}