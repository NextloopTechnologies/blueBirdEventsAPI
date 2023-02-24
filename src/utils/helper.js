export const formatFormError = (error) => {
    const { error: ignoreErrorObject, status = 500, msgText='Something went wrong!', data={}, ...rest} = error
    return {status, success: false, message: msgText, ...data }
};

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
};

const date = new Date();
const curr_date = date.getDate().toString().padStart(2, "0");
const curr_month = (date.getMonth() + 1).toString().padStart(2, "0");
const curr_year = date.getFullYear();
export const todaysDate = curr_year + "-" + curr_month + "-" + curr_date;;

