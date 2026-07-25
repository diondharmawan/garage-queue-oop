import { z } from 'zod';

/**
 * Regex format nomor HP Indonesia:
 * Contoh: 08123456789, +628123456789, 628123456789
 */
export const INDONESIAN_PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

/**
 * Regex format Plat Nomor Kendaraan Indonesia:
 * Contoh: B 1234 XYZ, D 8888 AA, AB 123 CD
 */
export const INDONESIAN_PLATE_REGEX = /^[A-Z]{1,2}\s?[0-9]{1,4}\s?[A-Z]{1,3}$/i;

export const queueTicketSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Nama pelanggan minimal 2 karakter')
    .max(50, 'Nama pelanggan maksimal 50 karakter'),
  
  phoneNumber: z
    .string()
    .trim()
    .regex(INDONESIAN_PHONE_REGEX, 'Format nomor HP tidak valid (contoh: 081234567890)')
    .optional()
    .or(z.literal('')),

  plateNumber: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase().replace(/\s+/g, ' '))
    .refine(
      (val) => INDONESIAN_PLATE_REGEX.test(val),
      'Format plat nomor tidak valid (contoh: B 1234 XYZ)'
    ),

  motorModel: z
    .string()
    .trim()
    .min(2, 'Merk/tipe motor minimal 2 karakter')
    .max(50, 'Merk/tipe motor maksimal 50 karakter'),

  motorAgeYears: z
    .number()
    .min(0, 'Usia motor tidak boleh negatif')
    .max(30, 'Usia motor maksimal 30 tahun')
    .default(0),

  serviceType: z.enum(['LIGHT', 'HEAVY']),

  serviceId: z
    .string()
    .uuid('Format serviceId harus berupa UUID valid')
    .optional()
    .or(z.literal('')),

  notes: z
    .string()
    .max(200, 'Catatan maksimal 200 karakter')
    .optional()
    .or(z.literal('')),
});

export type QueueTicketInput = z.infer<typeof queueTicketSchema>;
