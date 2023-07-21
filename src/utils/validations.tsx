import * as yup from 'yup';

export const initRegister = yup.object().shape({
  firstname: yup.string().required('* First name is required'),
  lastname: yup.string().required('* Last name is required'),
  street: yup.string().required('* Street is required'),
  streetname: yup.string().required('* Street Name is required'),
  city: yup.string().required('* City is required'),
  state: yup.string().required('* State is required'),
  zip: yup
    .string()
    .required('* Zip is required')
    .matches(/^\d+$/, 'Zip must be in number[0-9]'),
});

//   email: yup.string().email('Invalid email').required('Email is required')
