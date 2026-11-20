import * as Yup from 'yup';

export const AddPhotoSchema = Yup.object({
  source: Yup.mixed<FileList>().optional(),
  reviewId: Yup.number().required(),
});


export const AddReviewSchema = Yup.object({
  placeName: Yup.string().required(),
  content: Yup.string().required(),
  owner: Yup.string().required(),
});

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
