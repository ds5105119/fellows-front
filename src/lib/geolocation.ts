import { useState } from "react";
import { z } from "zod";

const addressSchema = z.object({
  address_name: z.string(),
  region_1depth_name: z.string(),
  region_2depth_name: z.string(),
  region_3depth_name: z.string(),
  mountain_yn: z.enum(["Y", "N"]),
  main_address_no: z.string(),
  sub_address_no: z.string(),
  zip_code: z.string(),
});

const roadAddressSchema = z.object({
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

const documentSchema = z.object({
  address: addressSchema,
  road_address: roadAddressSchema,
});

const responseSchema = z.object({
  meta: z.object({
    total_count: z.number(),
  }),
  documents: z.array(documentSchema),
});

interface locationType {
  loaded: boolean;
  coordinates?: { lat: number; lng: number };
  response?: z.infer<typeof responseSchema>;
  error?: { code: number; message: string };
}

const useGeolocation = () => {
  const [location, setLocation] = useState<locationType>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
  });

  // 성공에 대한 로직
  const onSuccess = async (location: { coords: { latitude: number; longitude: number } }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MAP_URL}/coord2addr?x=${location.coords.longitude}&y=${location.coords.latitude}`);

    if (!response.ok) {
      onError({ code: response.status, message: "API 호출에 실패했습니다." });
    }

    const data = await response.json();

    try {
      const parsed = responseSchema.parse(data);

      setLocation({
        loaded: true,
        coordinates: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        response: parsed,
      });
    } catch {
      onError({ code: response.status, message: "API 해석에 실패하였습니다." });
    }
  };

  // 에러에 대한 로직
  const onError = (error: { code: number; message: string }) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  const get = () => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  return { get, location };
};

export default useGeolocation;
