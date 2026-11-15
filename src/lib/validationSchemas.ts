import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  location: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  feature: Yup.string().oneOf(['elevator', 'stair', 'ramp', 'other']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  location: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  feature: Yup.string().oneOf(['elevator', 'stair', 'ramp', 'other']).required(),
  owner: Yup.string().required(),
});
