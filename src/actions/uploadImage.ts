
'use server';

import { supabase } from '@/lib/supabase';


export async function uploadImage(formData: FormData) {
  // Retrieve the uploaded file
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    return { error: 'No file selected.' };
  }

  // Validate the image
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heif', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid image format.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Image must be smaller than 5 MB.' };
  }

  // Generate a unique filename
  const filename = `${crypto.randomUUID()}.${file.type.split('/')[1]}`;

  // Upload the image to Supabase
  const { data, error } = await supabase.storage
    .from('review-images')
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  // Retrieve the public URL
  const { data: urlData } = supabase.storage
    .from('review-images')
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}
