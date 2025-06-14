"use server";

import { auth } from "@/auth";
import { UserBusinessDataNullableSchema, UserBusinessData, UpdateUserAttributes } from "@/@types/accounts/userdata";

export const getBusinessUserData = async () => {
  const url = `${process.env.NEXT_PUBLIC_USERDATA_URL}/welfare/business`;
  const session = await auth();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return UserBusinessDataNullableSchema.parse(data);
};

export const createBusinessUserData = async (data: UserBusinessData) => {
  const url = `${process.env.NEXT_PUBLIC_USERDATA_URL}/welfare/business`;
  const session = await auth();

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};

export const updateBusinessUserData = async (data: UserBusinessData) => {
  const url = `${process.env.NEXT_PUBLIC_USERDATA_URL}/welfare/business`;
  const session = await auth();

  await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};

export const updateUserData = async (data: UpdateUserAttributes) => {
  const url = `${process.env.NEXT_PUBLIC_USERDATA_URL}`;
  const session = await auth();

  await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};
