"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { categorizedFeatures } from "@/components/resource/project";
import { FeatureItemWithTooltip } from "@/components/form/featureitemwithtooltip";
import { UserERPNextProjectType } from "@/@types/service/erpnext";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<UserERPNextProjectType>;
}

export default function CreateProjectFormStep2({ form }: CreateProjectFormStep2Props) {
  const { control } = form;
  const prefix = "기타:";

  return (
    <>
      <FormField
        control={control}
        name="custom_features"
        render={({ field }) => (
          <FormItem>
            <div className="w-full flex flex-col gap-5">
              {categorizedFeatures.map((category) => (
                <div key={category.title} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="col-span-full text-sm font-medium mb-1">{category.title}</div>
                  {category.items.map((item) => (
                    <FeatureItemWithTooltip
                      key={item.title}
                      item={item}
                      isChecked={field.value?.some((f) => f.feature == item.title) || false}
                      onButtonClick={() => {
                        const current = field.value || [];
                        const include = current.some((f) => f.feature == item.title);
                        field.onChange(include ? current.filter((p) => p.feature !== item.title) : [...current, { doctype: "Features", feature: item.title }]);
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <Textarea
              className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 py-4 min-h-36 mt-6"
              placeholder="혹시 더 필요한 기능이 있다면 적어주세요."
              value={
                (field.value || [])
                  .find((f) => f.feature.startsWith(prefix))
                  ?.feature.replace(prefix, "")
                  .trim() || ""
              }
              onChange={(e) => {
                const current = field.value || [];
                const value = e.target.value;
                const index = (current || []).findIndex((f) => f.feature.startsWith(prefix));

                if (value) {
                  if (index !== -1) {
                    current[index] = { doctype: "Features", feature: `${prefix} ${value}` };
                    field.onChange(current);
                  } else {
                    field.onChange([...current, { doctype: "Features", feature: `${prefix} ${value}` }]);
                  }
                } else {
                  if (index !== -1) {
                    field.onChange(current.splice(index, 1));
                  }
                }
              }}
              rows={3}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
