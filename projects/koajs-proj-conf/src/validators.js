const validator = require('validator');
const moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';

const bookItemValidators = {
    name: {
        required: true,
        validate: value => !validator.isEmpty(value),
        message: 'name must not be empty',
    },
    isbn: {
        required: true,
        validate: value => validator.isISBN(value),
        message: 'invalid ISBN',
    },
    publishedAt: {
        required: false,
        validate: value => moment(value, DATE_FORMAT, true).isValid(),
        message: `invalid time format (${DATE_FORMAT})`,
    },
};

const validate = (validatorsObj, objToValidate) => {
    const messages = Object.keys(validatorsObj).reduce((prevObj, key) => {
        const fieldValidator = validatorsObj[key];
        const value = objToValidate[key];
        if ((typeof value === 'undefined' || value === null)) {
            if (fieldValidator.required) {
                return {
                    ...prevObj,
                    [key]: 'required but not provided',
                };
            }
            return { ...prevObj };
        }

        if (!fieldValidator.validate(value)) {
            return {
                ...prevObj,
                [key]: fieldValidator.message,
            };
        }
        return { ...prevObj };
    }, {});

    return {
        isValid: Object.keys(messages).length === 0,
        messages,
    };
};

const sanitize = (sanitizersObj, objToSanitize) => {
    return Object.keys(objToSanitize).reduce((prevObj, key) => {
        if (key in sanitizersObj) {
            return {
                ...prevObj,
                [key]: objToSanitize[key],
            };
        }
        return { ...prevObj };
    }, {});
};

module.exports = {
    validate,
    sanitize,
    bookItemValidators,
};
