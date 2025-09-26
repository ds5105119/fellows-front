"use server";

import { auth } from "@/auth";
import { UpdateUserAttributes, UserAttributesSchema, ExternalUserAttributesSchema, ExternalUsersAttributesSchema } from "@/@types/accounts/userdata";

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

export const updatePhoneRequest = async (phoneNumber: string) => {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/phone`, {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber }),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  return response.status;
};

export const updatePhoneVerify = async (phoneNumber: string, otp: string) => {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/phone/verify`, {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber, otp: otp }),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  return response.status;
};

export const updateEmailRequest = async (email: string) => {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/email`, {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  return response.status;
};

export const updateEmailVerify = async (email: string, otp: string) => {
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_USER_URL}/data/email/verify`, {
    method: "POST",
    body: JSON.stringify({ email: email, otp: otp }),
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
    },
    redirect: "follow",
    credentials: "include",
  });

  return response.status;
};
