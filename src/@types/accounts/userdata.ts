import { z } from "zod";

export const LocationSchema = z.object({
  location: z.tuple([z.number(), z.number()]),
});

export const OIDCAddressSchema = LocationSchema.extend({
  locality: z.string(),
  sub_locality: z.string(),
  region: z.string(),
  postal_code: z.string(),
  country: z.string(),
  street: z.string(),
  formatted: z.string().optional().default(""),
});

// 🔹 KakaoAddressDto (LocationDto + Coord2AddrResponse)
export const AddressSchema = z.object({
  address_name: z.string(),
  region_1depth_name: z.string(),
  region_2depth_name: z.string(),
  region_3depth_name: z.string(),
  mountain_yn: z.enum(["Y", "N"]),
  main_address_no: z.string(),
  sub_address_no: z.string(),
  zip_code: z.string().nullable().optional(),
});

// 🔹 RoadAddress
export const RoadAddressSchema = z.object({
  address_name: z.string(),
  region_1depth_name: z.string(),
  region_2depth_name: z.string(),
  region_3depth_name: z.string(),
  road_name: z.string(),
  underground_yn: z.enum(["Y", "N"]),
  main_building_no: z.string(),
  sub_building_no: z.string(),
  building_name: z.string(),
  zone_no: z.string(),
});

// 🔹 Coord2AddrDto
export const Coord2AddrDtoSchema = z.object({
  x: z.string(),
  y: z.string(),
  input_coord: z.enum(["WGS84", "WCONGNAMUL", "CONGNAMUL", "WTM", "TM"]).default("WGS84"),
});

// 🔹 Coord2AddrResponseMeta
export const Coord2AddrResponseMetaSchema = z.object({
  total_count: z.number().min(0).max(1),
});

// 🔹 Coord2AddrResponseDocument
export const Coord2AddrResponseDocumentSchema = z.object({
  address: AddressSchema,
  road_address: RoadAddressSchema,
});

// 🔹 Coord2AddrResponse
export const Coord2AddrResponseSchema = z.object({
  meta: Coord2AddrResponseMetaSchema,
  documents: z.array(Coord2AddrResponseDocumentSchema),
});
export const KakaoAddressSchema = LocationSchema.merge(Coord2AddrResponseSchema);

// 🔹 UserAttributes
export const UserAttributesSchema = z.object({
  sub: z.string(),
  bio: z.array(z.string()).optional().nullable(),
  birthdate: z.array(z.string()).optional().nullable(),
  country: z.array(z.string()).optional().nullable(),
  formatted: z.array(z.string()).optional().nullable(),
  gender: z.array(z.string()).optional().nullable(),
  link: z.array(z.string().url()).optional().nullable(),
  locale: z.array(z.string()).optional().nullable(),
  locality: z.array(z.string()).optional().nullable(),
  location: z.array(z.string()).optional().nullable(),
  name: z.array(z.string()).optional().nullable(),
  phoneNumber: z.array(z.string()).optional().nullable(),
  phoneNumberVerified: z.array(z.string()).optional().nullable(),
  picture: z.array(z.string()).optional().nullable(),
  postal_code: z.array(z.string()).optional().nullable(),
  region: z.array(z.string()).optional().nullable(),
  street: z.array(z.string()).optional().nullable(),
  sub_locality: z.array(z.string()).optional().nullable(),
  userData: z.array(z.string()).optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const ProjectAdminUserAttributesSchema = z.object({
  sub: z.string(),
  bio: z.array(z.string()).optional().nullable(),
  birthdate: z.array(z.string()).optional().nullable(),
  country: z.array(z.string()).optional().nullable(),
  formatted: z.array(z.string()).optional().nullable(),
  gender: z.array(z.string()).optional().nullable(),
  link: z.array(z.string().url()).optional().nullable(),
  locale: z.array(z.string()).optional().nullable(),
  locality: z.array(z.string()).optional().nullable(),
  location: z.array(z.string()).optional().nullable(),
  name: z.array(z.string()).optional().nullable(),
  phoneNumber: z.array(z.string()).optional().nullable(),
  picture: z.array(z.string()).optional().nullable(),
  postal_code: z.array(z.string()).optional().nullable(),
  region: z.array(z.string()).optional().nullable(),
  street: z.array(z.string()).optional().nullable(),
  sub_locality: z.array(z.string()).optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const ExternalUserAttributesSchema = z.object({
  sub: z.string(),
  bio: z.array(z.string()).optional().nullable(),
  birthdate: z.array(z.string()).optional().nullable(),
  gender: z.array(z.string()).optional().nullable(),
  link: z.array(z.string().url()).optional().nullable(),
  name: z.array(z.string()).optional().nullable(),
  picture: z.array(z.string()).optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const ExternalUsersAttributesSchema = z.array(ExternalUserAttributesSchema);

export const UpdateUserAttributesSchema = z.object({
  sub: z.string(),
  bio: z.array(z.string()).optional().nullable(),
  birthdate: z.array(z.string()).optional().nullable(),
  country: z.array(z.string()).optional().nullable(),
  formatted: z.array(z.string()).optional().nullable(),
  gender: z.array(z.string()).optional().nullable(),
  link: z.array(z.string().url()).optional().nullable(),
  locale: z.array(z.string()).optional().nullable(),
  locality: z.array(z.string()).optional().nullable(),
  location: z.array(z.string()).optional().nullable(),
  name: z.array(z.string()).optional().nullable(),
  phoneNumber: z.array(z.string()).optional().nullable(),
  phoneNumberVerified: z.array(z.string()).optional().nullable(),
  picture: z.array(z.string()).optional().nullable(),
  postal_code: z.array(z.string()).optional().nullable(),
  region: z.array(z.string()).optional().nullable(),
  street: z.array(z.string()).optional().nullable(),
  sub_locality: z.array(z.string()).optional().nullable(),
  userData: z.array(z.string()).optional().nullable(),
});

export const userData = z.object({
  dashboard_1_open: z.boolean().optional().nullable(),
  dashboard_1_2_end: z.boolean().optional().nullable(),
});

export type Address = z.infer<typeof AddressSchema>;
export type RoadAddress = z.infer<typeof RoadAddressSchema>;
export type Coord2AddrDto = z.infer<typeof Coord2AddrDtoSchema>;
export type Coord2AddrResponseMeta = z.infer<typeof Coord2AddrResponseMetaSchema>;
export type Coord2AddrResponseDocument = z.infer<typeof Coord2AddrResponseDocumentSchema>;
export type Coord2AddrResponse = z.infer<typeof Coord2AddrResponseSchema>;
export type KakaoAddressDto = z.infer<typeof KakaoAddressSchema>;
export type LocationDto = z.infer<typeof LocationSchema>;
export type OIDCAddressDto = z.infer<typeof OIDCAddressSchema>;
export type UserAttributes = z.infer<typeof UserAttributesSchema>;
export type UserData = z.infer<typeof userData>;
export type ProjectAdminUserAttributes = z.infer<typeof ProjectAdminUserAttributesSchema>;
export type ExternalUsersAttributes = z.infer<typeof ExternalUsersAttributesSchema>;
export type UpdateUserAttributes = z.infer<typeof UpdateUserAttributesSchema>;
