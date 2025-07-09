"use server";

import { auth } from "@/auth";
import {
  UserBusinessDataNullableSchema,
  UserBusinessData,
  UpdateUserAttributes,
  UserAttributesSchema,
  ExternalUserAttributesSchema,
  ExternalUsersAttributesSchema,
} from "@/@types/accounts/userdata";

export const getBusinessUserData = async () => {
  const url = `${process.env.NEXT_PUBLIC_USER_URL}/data/welfare/business`;
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
  const url = `${process.env.NEXT_PUBLIC_USER_URL}/data/welfare/business`;
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
  const url = `${process.env.NEXT_PUBLIC_USER_URL}/data/welfare/business`;
  const session = await auth();

  await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/${session.sub}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  const data = await response.json();
  return UserAttributesSchema.parse(data);
};

export const getUser = async (id: string) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  const data = await response.json();
  return ExternalUserAttributesSchema.parse(data);
};

export const getUsers = async (ids: string[]) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not logged in");
  }

  const params = new URLSearchParams();
  ids.forEach((id) => params.append("id", id));

  const response = await fetch(`$${process.env.NEXT_PUBLIC_USER_URL}/data?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  const data = await response.json();
  return ExternalUsersAttributesSchema.parse(data);
};

export const updateUser = async (data: UpdateUserAttributes) => {
  const session = await auth();

  await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};

export const updateEmailRequest = async (email: string) => {
  const session = await auth();

  await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/email`, {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });
};
