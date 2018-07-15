const buildFieldSerialzier = (idField) => {
    return {
        convert: (obj, key) => ({ [idField]: obj[key] }),
    }
}

const fieldSerializer = {
    convert: (obj, key) => ({ [key]: obj[key] }),
};

const bookSerializers = {
    _key: buildFieldSerialzier("id"),
    name: fieldSerializer,
    isbn: fieldSerializer,
    publishedAt: fieldSerializer,
};

const serialize = (serializersToUse, objToSerialize) => {
    return Object.keys(objToSerialize).reduce((prevObj, key) => {
        const serializer = serializersToUse[key];
        if (serializer) {
            return {
                ...prevObj,
                ...serializer.convert(objToSerialize, key),
            };
        }
        return { ...prevObj };
    }, {});
};

const serializeBook = result => serialize(bookSerializers, result);

module.exports = {
    serializeBook,
};