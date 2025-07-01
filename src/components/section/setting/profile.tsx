"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit3, MapPin, LinkIcon, UserIcon, Check, X, Plus, Camera, ChevronDown } from "lucide-react";
import { getUser, updateUser } from "@/hooks/fetch/server/user";
import { type User } from "@/@types/accounts/userdata";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  className?: string;
  textSize?: string;
}

function EditableField({ value, onSave, placeholder, multiline = false, maxLength, className = "", textSize = "text-sm" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <motion.div className={`relative ${className}`} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="editing" transition={{ duration: 0.15 }} className="flex items-center gap-2">
            <div className={`relative ${multiline ? "min-h-[44px]" : "h-[44px]"} flex-1 rounded-xl overflow-hidden`}>
              <motion.div className="absolute inset-0 bg-zinc-100" initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />
              {multiline ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  className={`relative z-10 w-full min-h-[44px] max-h-[120px] p-3 ${textSize} bg-transparent rounded-xl resize-none outline-none border-none font-inherit`}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  className={`relative z-10 w-full h-[44px] px-3 ${textSize} bg-transparent rounded-xl outline-none border-none font-inherit`}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  autoFocus
                />
              )}
            </div>
            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1, opacity: 1 }} className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="group cursor-pointer"
            onClick={() => setIsEditing(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`relative ${multiline ? "min-h-[44px]" : "h-[44px]"} rounded-xl overflow-hidden`}>
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundColor: isHovered ? "#f4f4f5" : "#fafafa",
                }}
                transition={{ duration: 0.2 }}
              />
              <div className="relative z-10 flex items-center justify-between px-3 py-2 h-full">
                <span className={`flex-1 ${!value ? "text-gray-400" : "text-gray-900"} ${multiline ? "py-1" : ""} ${textSize}`}>{value || placeholder}</span>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
                  <Edit3 className="h-4 w-4 text-gray-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SelectableFieldProps {
  value: string;
  onSave: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  textSize?: string;
}

function SelectableField({ value, onSave, options, placeholder, className = "", textSize = "text-sm" }: SelectableFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onSave(selectedValue);
    setIsOpen(false);
  };

  const displayValue = options.find((option) => option.value === value)?.label || placeholder;

  return (
    <motion.div className={`relative ${className}`} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} ref={dropdownRef}>
      <motion.div
        className="group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[44px] rounded-xl overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundColor: isHovered ? "#f4f4f5" : "#fafafa",
            }}
            transition={{ duration: 0.2 }}
          />
          <div className="relative z-10 flex items-center justify-between h-full px-3 py-2">
            <span className={`flex-1 ${!value ? "text-gray-400" : "text-gray-900"} ${textSize}`}>{displayValue}</span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <motion.div animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {options.map((option) => (
              <motion.div
                key={option.value}
                className={`px-3 py-2 cursor-pointer transition-colors ${textSize} ${value === option.value ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                onClick={() => handleSelect(option.value)}
                whileHover={{ backgroundColor: value === option.value ? "rgb(239 246 255)" : "rgb(249 250 251)" }}
              >
                {option.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        setLinks(["https://github.com/johndoe", "https://linkedin.com/in/johndoe"]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateField = async (field: string, value: string) => {
    try {
      await updateUser({ [field]: value });
      setUser((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleUpdateAttribute = async (attribute: string, value: string) => {
    try {
      await updateUser({ [attribute]: value });
      setUser((prev: any) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attribute]: [value],
        },
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const addLink = () => {
    if (links.length < 4) {
      setLinks([...links, ""]);
    }
  };

  const updateLink = async (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);

    try {
      await updateUser({ link: newLinks.filter((link) => link.trim() !== "") });
    } catch (error) {
      console.error("Failed to update links:", error);
    }
  };

  const removeLink = async (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);

    try {
      await updateUser({ link: newLinks });
    } catch (error) {
      console.error("Failed to update links:", error);
    }
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto p-6 space-y-16">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-start gap-10">
        <div className="relative">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
            <Avatar className="w-36 h-36 ring-4 ring-white shadow-xl">
              <AvatarImage src={user.picture ? user.picture[0] : ""} alt={user.name ? user.name[0] : ""} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">{user.name ? user.name[0] : ""}</AvatarFallback>
            </Avatar>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </motion.button>
          </motion.div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <EditableField
              value={user.name ? user.name[0] : ""}
              onSave={(value) => handleUpdateAttribute("name", value)}
              placeholder="Enter your name"
              className="text-2xl font-bold"
              textSize="text-2xl font-bold"
            />
          </div>

          <EditableField
            value={user.bio ? user.bio[0] : ""}
            onSave={(value) => handleUpdateAttribute("bio", value)}
            placeholder="Tell us about yourself..."
            multiline
            maxLength={100}
            className="text-gray-700"
            textSize="text-base"
          />
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Birth Date</label>
            <EditableField
              value={user.birthdate ? user.birthdate[0] : ""}
              onSave={(value) => handleUpdateAttribute("birthdate", value)}
              placeholder="YYYY-MM-DD"
              textSize="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <SelectableField
              value={user.gender ? user.gender[0] : ""}
              onSave={(value) => handleUpdateAttribute("gender", value)}
              options={genderOptions}
              placeholder="Select gender"
              textSize="text-sm"
            />
          </div>
        </div>
      </motion.section>

      {/* Links */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <LinkIcon className="h-4 w-4 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Links</h2>
          </div>
          {links.length < 4 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={addLink} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <EditableField
                  value={link}
                  onSave={(value) => updateLink(index, value)}
                  placeholder="https://example.com"
                  className="flex-1"
                  textSize="text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeLink(index)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
          {links.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm py-8 text-center">
              No links added yet
            </motion.p>
          )}
        </div>
      </motion.section>

      {/* Address Information */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Address</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Street</label>
            <EditableField value="" onSave={(value) => handleUpdateField("street", value)} placeholder="Street address" textSize="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">City</label>
            <EditableField value="" onSave={(value) => handleUpdateField("locality", value)} placeholder="City" textSize="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">State/Region</label>
            <EditableField value="" onSave={(value) => handleUpdateField("region", value)} placeholder="State/Region" textSize="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Postal Code</label>
            <EditableField value="" onSave={(value) => handleUpdateField("postal_code", value)} placeholder="Postal code" textSize="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Country</label>
            <EditableField value="" onSave={(value) => handleUpdateField("country", value)} placeholder="Country" textSize="text-sm" />
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
