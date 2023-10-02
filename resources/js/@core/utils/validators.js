import { isEmpty, isEmptyArray, isNullOrUndefined } from './index'
import { router } from '@inertiajs/vue3'
import { reactive } from 'vue'
import moment from 'moment';


// 👉 Required Validator
export const requiredValidator = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Required field'

  return !!String(value).trim().length || 'Required field'
}

// 👉 Email Validator
export const emailValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'Invalid email address'

  return re.test(String(value)) || 'Invalid email address'
}

// 👉 Password Validator
export const passwordValidator = password => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  const validPassword = regExp.test(password)

  return (
    // eslint-disable-next-line operator-linebreak
    validPassword ||
        'Password must contain minimum 8 characters, including 1 uppercase, 1 lowercase and 1 special character')
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || 'Password does not match'

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Enter number between ${min} and ${max}`
}

// 👉 Integer Validator
export const integerValidator = value => {
  if (isEmpty(value))
    return true
  if (Array.isArray(value))
    return value.every(val => /^-?[0-9]+$/.test(String(val))) || 'This field must be an number'

  return /^-?[0-9]+$/.test(String(value)) || 'Field must be an number'
}

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'Field format is invalid'
}

// 👉 Alpha Validator
export const alphaValidator = value => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'Field may only contain alphabetic characters'
}

// 👉 URL Validator
export const urlValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(String(value)) || 'URL is invalid'
}

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `Field must be at least ${length} characters`
}

// 👉 min Length Validator
export const minLengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length >= length || `Field must be at least ${length} characters`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return /^[0-9A-Z _-]*$/i.test(valueAsString) || 'All Character are not valid'
}

export const minValueValidator = (value, minValue) => {
    if (value < minValue) {
      return `The minimum value is ${minValue}`
    }
}

// 👉 min Length Validator
export const minPhoneLengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length >= length || `Phone number must be at least ${length} digits`
}

export const amountValidator = value => {
  if (isEmpty(value))
    return true
  if (!isNaN(value))
    return true

  return 'Amount is invalid'
}

export const minAmountValidator = (value, minValue) => {
  if (parseFloat(value) < parseFloat(minValue)) {
    return `The minimun value is ${minValue}`
  }
}

export const maxRefundAmountValidator = (value, maxValue) => {
  if (parseFloat(value) > parseFloat(maxValue)) {
    return `The maximum refund amount is ${maxValue}`
  }
}

export const maxValueValidator = (value, maxValue) => {
  if (value > maxValue) {
    return `The maximum value is ${maxValue}`
  }
}

export const maxLengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length <= length || `This field must not be longer than ${length} characters`
}

// 👉 staff invite Validator
export const inviteEmailValidator = async(value, id = null) => {
  if (isEmpty(value))
    return true;
    const getEmailValidated  = (value) => {
      const form = reactive({
        email: value,
        id,
      })

      return new Promise((resolve, reject) => {
        router.post('/organization/staff-invite-validation', form, {
          preserveScroll: true,
          preserveState: true,
          onSuccess : (data) => {
            resolve(true);
          },
          onError : (data) => {
            resolve(data.email)
          },
        });
      });
    }

    return await getEmailValidated(value);
}

// 👉 user unique email validator
export const uniqueEmailValidator = async(value, id = null) => {
  if (isEmpty(value))
    return true;
    const getEmailValidated  = (value) => {
      const form = reactive({
        email: value,
        id,
      })

      return new Promise((resolve, reject) => {
        router.post('/unique-email-validator', form, {
          preserveScroll: true,
          preserveState: true,
          onSuccess : (data) => {
            resolve(true);
          },
          onError : (data) => {
            resolve(data.email)
          },
        });
      });
    }

    return await getEmailValidated(value);
}

export const endDateValidator = async(value, startDate) => {
  if (isEmpty(value)) {
    return true;
  }

  if (isEmpty(startDate)) {
    return true;
  }

  let start_date = moment(startDate, 'DD/MM/YYYY');
  let end_date = moment(value, 'DD/MM/YYYY');
  if(end_date.isSameOrBefore(start_date)) {
    console.log('Field must be a date after start date');

    return `Field must be a date after start date`;
  } else {
    return true;
  }
}
