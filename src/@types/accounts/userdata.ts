import { z } from "zod";

export const UserDataSchema = z.object({
  id: z.number().optional(),
  sub: z.string().optional(),

  overcome: z.number().default(0),
  household_size: z.number().default(0),

  multicultural: z.boolean().default(false),
  north_korean: z.boolean().default(false),
  single_parent_or_grandparent: z.boolean().default(false),
  homeless: z.boolean().default(false),
  new_resident: z.boolean().default(false),
  multi_child_family: z.boolean().default(false),
  extend_family: z.boolean().default(false),

  disable: z.boolean().default(false),
  veteran: z.boolean().default(false),
  disease: z.boolean().default(false),

  prospective_parents_or_infertility: z.boolean().default(false),
  pregnant: z.boolean().default(false),
  childbirth_or_adoption: z.boolean().default(false),

  farmers: z.boolean().default(false),
  fishermen: z.boolean().default(false),
  livestock_farmers: z.boolean().default(false),
  forestry_workers: z.boolean().default(false),

  unemployed: z.boolean().default(false),
  employed: z.boolean().default(false),

  academic_status: z.number().default(0),
});
export const PartialUserDataSchema = UserDataSchema.partial();

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
// 🔹 OIDCAddressDto
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
export const UserAttributesSchema = OIDCAddressSchema.extend({
  username: z.string().min(3).max(255),
  email: z.string().email().max(255),
  name: z.string(),
  birthdate: z.string(),
  gender: z.enum(["male", "female"]),

  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),

  phoneNumber: z.string().nullable().optional(),
  phoneNumberVerified: z.boolean().nullable().optional(),

  picture: z.string().nullable().optional(),
  bio: z.string().min(0).max(100).nullable().optional(),
  link: z.array(z.string()).max(4).nullable().optional(),
});

export const UpdateUserAttributesSchema = OIDCAddressSchema.extend({
  username: z.string().min(3).max(255).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  name: z.string().optional().nullable(),
  birthdate: z.string().optional().nullable(),
  gender: z.enum(["male", "female"]).optional().nullable(),

  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),

  phoneNumber: z.string().optional().nullable(),
  phoneNumberVerified: z.boolean().optional().nullable(),

  picture: z.string().optional().nullable(),
  bio: z.string().min(0).max(100).optional().nullable(),
  link: z.array(z.string()).max(4).optional().nullable(),
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
export type UpdateUserAttributes = z.infer<typeof UpdateUserAttributesSchema>;
export type UserData = z.infer<typeof UserDataSchema>;
export type PartialUserData = z.infer<typeof PartialUserDataSchema>;
export type UserBusinessData = z.infer<typeof UserBusinessDataSchema>;
export type UserBusinessDataNullable = z.infer<typeof UserBusinessDataNullableSchema>;
