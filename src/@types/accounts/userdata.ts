import { z } from "zod";

export const UserBusinessDataSchema = z.object({
  id: z.number().optional(),
  sub: z.string().optional(),

  ja1101: z.boolean().nullable(), // 예비창업자
  ja1102: z.boolean().nullable(), // 영업중
  ja1103: z.boolean().nullable(), // 생계곤란/폐업예정자

  ja1201: z.boolean().nullable(), // 음식적업
  ja1202: z.boolean().nullable(), // 제조업
  ja1299: z.boolean().nullable(), // 기타업종

  ja2101: z.boolean().nullable(), // 중소기업
  ja2102: z.boolean().nullable(), // 사회복지시설
  ja2103: z.boolean().nullable(), // 기관/단체

  ja2201: z.boolean().nullable(), // 제조업
  ja2202: z.boolean().nullable(), // 농업,임업 및 어업
  ja2203: z.boolean().nullable(), // 정보통신업
  ja2299: z.boolean().nullable(), // 기타업종
});
export const UserBusinessDataNullableSchema = UserBusinessDataSchema.nullable();

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
})

export const ExternalUserAttributesSchema = z.object({
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

export const UserSchema = z.object({
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

export type User = z.infer<typeof UserSchema>;
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
export type UserBusinessData = z.infer<typeof UserBusinessDataSchema>;
export type UserBusinessDataNullable = z.infer<typeof UserBusinessDataNullableSchema>;
