export const formatFormError = (error) => {
    const { error: ignoreErrorObject, status = 500, msgText='Something went wrong!', data={}, ...rest} = error
    return {status, success: false, message: msgText, ...data }
}

export const formatJoiData = (data) => {
    const { error : {details=[]} = {}} = data;
    let isInValid = false ;
    const errors = details.reduce((errors, detail) => {
        if(detail.message) {
            isInValid = true;
            errors[detail.context.label] = detail.message
        }
        return errors;
    }, {});
    return { values: data.value, errors, isInValid };
}

export const generateRandomNumber = () => Math.floor(100000 + Math.random() * 999999);

export const diffInMinutes  = (cdt, pdt) => {
    let diff = (cdt.getTime() - pdt.getTime()) / 1000;
    diff /= 60; 
    return Math.abs(Math.round(diff));
};