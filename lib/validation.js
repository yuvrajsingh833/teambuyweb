const validateEmail = (params = null, message = null) => {
    let response = { error: false, message: '' }
    let testString = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (params == null || params == '' || params.trim() == '') {
        response['error'] = true;
        response['message'] = message.emptyField || 'Email cannot be empty';
        return response;
    } else if (testString.test(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Please enter a valid email';
        return response;
    }
}

const validateMobile = (params = null, message = null) => {
    let response = { error: false, message: '' }
    let testString = /^\d+$/;

    if (params == null || params == '' || params.trim() == '') {
        response['error'] = true;
        response['message'] = message.emptyField || 'Mobile number cannot be empty';
        return response;
    } else if (params.trim().length != 10) {
        response['error'] = true;
        response['message'] = message.validField || 'Please enter a valid mobile number';
        return response;
    } else if (testString.test(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Please enter a valid mobile number';
        return response;
    }
}

const validatePassword = (params = null, message = null) => {
    let response = { error: false, message: '' }
    let testString = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{8,50}$/

    if (params == null || params == '' || params.trim() == '') {
        response['error'] = true;
        response['message'] = message.emptyField || 'Password cannot be empty';
        return response;
    } else if (testString.test(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Password must contain at least 8 character. It must include at least one uppercase (A-Z), one lowercase (a-z) and one number (0-9)';
        return response;
    }
}

const validateAlphaString = (params = null, message = null) => {
    let response = { error: false, message: '' }
    let testString = /^[A-Za-z\d\s]+$/;

    if (params == null || params == '' || params.trim() == '') {
        response['error'] = true;
        response['message'] = message.emptyField || 'Field cannot be empty';
        return response;
    } else if (testString.test(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Only alphabet are accepted';
        return response;
    }
}

const validateAlphaNumericString = (params = null, message = null) => {
    let response = { error: false, message: '' }
    let testString = /^[a-zA-Z0-9]+$/;

    if (params == null || params == '' || params.trim() == '') {
        response['error'] = true;
        response['message'] = message.emptyField || 'Field cannot be empty';
        return response;
    } else if (testString.test(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Only alphabet or numbers are accepted';
        return response;
    }
}

const validateField = (params = null, message = null) => {
    let response = { error: false, message: '' }

    if (params != null && params != '' && params.trim() != '') {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.emptyField || 'Field cannot be empty';
        return response;
    }
};

const validateArray = (params = null, message = null) => {
    let response = { error: false, message: '' }

    if (params != null && params != '' && typeof params == "object") {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Invalid array';
        return response;
    }
};

const validateObject = (params = null, message = null) => {
    let response = { error: false, message: '' }

    if (params != null && params != '' && typeof params == "object") {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Invalid object';
        return response;
    }
};

const validateNumericField = (params = null, message = null) => {
    let response = { error: false, message: '' }

    if (params != null && params != '' && params != 0 && !isNaN(params)) {
        return response;
    } else {
        response['error'] = true;
        response['message'] = message.validField || 'Please enter only numeric value';
        return response;
    }
};


export { validateEmail, validateMobile, validatePassword, validateAlphaString, validateAlphaNumericString, validateField, validateArray, validateObject, validateNumericField }