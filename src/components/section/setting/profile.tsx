"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Camera, Save, Loader2, X } from "lucide-react";
import { getUser, updateUser } from "@/hooks/fetch/server/user";
import { UpdateUserAttributesSchema, type UpdateUserAttributes, type UserAttributes } from "@/@types/accounts/userdata";
import { getPresignedPutUrl, uploadFileToPresignedUrl } from "@/hooks/fetch/presigned";

export default function UserProfile() {
  const [user, setUser] = useState<UserAttributes | undefined>();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<UpdateUserAttributes>({
    resolver: zodResolver(UpdateUserAttributesSchema),
    defaultValues: {
      name: [],
      bio: [],
      birthdate: [],
      gender: [],
      link: [],
      picture: [],
      street: [],
      locality: [],
      region: [],
      postal_code: [],
      country: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
    setValue,
    watch,
  } = form;

  const watchedPicture = watch("picture");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        // Set initial links
        const userLinks = userData.link || [];
        setLinks(userLinks);

        reset(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  // Sync links state with form when links change
  useEffect(() => {
    setValue("link", links);
  }, [links, setValue]);

  const onSubmit = async (data: UpdateUserAttributes) => {
    try {
      // Filter out empty values
      const filteredData = Object.fromEntries(
        Object.entries(data)
          .filter(([, value]) => {
            if (Array.isArray(value)) {
              return value.length > 0 && value.some((v) => v && v.trim() !== "");
            }
            return false;
          })
          .map(([key, value]) => [key, Array.isArray(value) ? value.filter((v) => v && v.trim() !== "") : value])
      ) as UpdateUserAttributes;

      await updateUser(filteredData);
      setUser((prev) => ({
        ...prev,
        ...filteredData,
      }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const presigned = await getPresignedPutUrl();
        await uploadFileToPresignedUrl({ file, presigned });
        const result = `${process.env.NEXT_PUBLIC_R2_URL}/${presigned.key}`;

        setValue("picture", [result]);
        setUser((prev) => ({ ...prev, picture: [result] }));
        await updateUser({ picture: [result] });
      } catch (error) {
        console.error("업로드 중 오류:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const addLink = () => {
    if (links.length < 4) {
      setLinks([...links, ""]);
    }
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((__, i) => i !== index);
    setLinks(newLinks);
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-pulse">
          <div className="flex items-center gap-8 mb-12">
            <div className="w-36 h-36 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-500">Failed to load user data</p>
      </div>
    );
  }

  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  // Use the watched picture value or fallback to user picture
  const currentPicture = watchedPicture?.[0] || user?.picture?.[0] || "";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full space-y-16">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full flex items-center gap-2 p-4 rounded-xl bg-muted"
          >
            <motion.div whileTap={{ scale: 0.98 }} className="relative select-none w-fit">
              <input id="profile" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || isSubmitting} />

              <label htmlFor="profile" className="cursor-pointer">
                <motion.div initial={{ opacity: 1 }} whileHover={{ opacity: 0.3 }} className="transition-opacity">
                  <Avatar className="size-18">
                    <AvatarImage src={currentPicture || "/placeholder.svg"} alt={user?.name?.[0] || ""} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.name?.[0]?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 z-10 rounded-full bg-zinc-50 flex items-center justify-center"
                >
                  <Camera className="size-5 text-gray-600" />
                </motion.div>

                {uploading && (
                  <motion.div className="absolute inset-0 z-30 rounded-full bg-zinc-50 flex items-center justify-center">
                    <Loader2 className="size-5 text-gray-600 animate-spin" />
                  </motion.div>
                )}
              </label>
            </motion.div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="sr-only">Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value?.[0] || ""}
                      onChange={(e) => field.onChange([e.target.value])}
                      placeholder="이름을 입력하세요"
                      className="md:text-xl font-bold h-12 text-black w-full shadow-none border-0 focus-visible:ring-0"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Personal Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">개인정보</h2>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">소개</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value?.[0] || ""}
                      onChange={(e) => field.onChange([e.target.value])}
                      placeholder="Tell us about yourself..."
                      maxLength={100}
                      className="min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">Birth Date</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} type="date" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">Gender</FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0] || ""} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.section>

          {/* Links */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Links</h2>
              {links.length < 4 && (
                <Button onClick={addLink} variant="outline" type="button" disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input value={link} onChange={(e) => updateLink(index, e.target.value)} placeholder="https://example.com" disabled={isSubmitting} />
                  </div>
                  <Button
                    onClick={() => removeLink(index)}
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={isSubmitting}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {links.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No links added yet</p>}
            </div>
          </motion.section>

          {/* Address Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Address</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">Street</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="Street address"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">City</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="City" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">State/Region</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="State/Region"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="Postal code"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">Country</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="Country" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.section>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end pt-8 border-t border-gray-200"
          >
            <Button type="submit" disabled={isSubmitting || !isDirty} className="px-8 py-3">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}
