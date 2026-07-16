/**
 * Uzbekistan's regions (hudud). Values must stay byte-for-byte identical to
 * back/models.py's RegionEnum -- Pydantic validates the incoming string
 * against those exact enum values, so a mismatch here fails registration
 * with a 422 rather than something obviously wrong on the frontend.
 */
export const REGION_OPTIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg'ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog'iston",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
] as const;

export type Region = (typeof REGION_OPTIONS)[number];
