import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';

export interface Inspection {
  id: string;
  rope_type: string;
  condition: string;
  location: string;
  date: string;
  notes: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface InspectionFormData {
  rope_type: string;
  condition: string;
  location: string;
  notes: string;
  images: string[];
}

// Fetch all inspections
export async function getAllInspections(): Promise<Inspection[]> {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching inspections:', error);
    throw error;
  }
}

// Fetch single inspection
export async function getInspection(id: string): Promise<Inspection | null> {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching inspection:', error);
    return null;
  }
}

// Create new inspection
export async function createInspection(
  formData: InspectionFormData
): Promise<Inspection | null> {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .insert([
        {
          rope_type: formData.rope_type,
          condition: formData.condition,
          location: formData.location,
          notes: formData.notes,
          images: formData.images,
          date: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating inspection:', error);
    throw error;
  }
}

// Update inspection
export async function updateInspection(
  id: string,
  formData: Partial<InspectionFormData>
): Promise<Inspection | null> {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating inspection:', error);
    throw error;
  }
}

// Delete inspection
export async function deleteInspection(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('inspections').delete().eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting inspection:', error);
    throw error;
  }
}

// Upload image to Supabase Storage
export async function uploadImage(
  imageUri: string,
  inspectionId: string
): Promise<string | null> {
  try {
    const fileName = `${inspectionId}/${Date.now()}.jpg`;
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.storage
      .from('inspection-images')
      .upload(fileName, Buffer.from(base64, 'base64'), {
        contentType: 'image/jpeg',
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Get public URL for image
export function getImagePublicUrl(imagePath: string): string {
  const { data } = supabase.storage
    .from('inspection-images')
    .getPublicUrl(imagePath);
  return data.publicUrl;
}
