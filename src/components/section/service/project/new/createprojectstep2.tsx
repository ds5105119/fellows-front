"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { categorizedFeatures } from "@/components/resource/project";
import { FeatureItemWithTooltip } from "@/components/form/featureitemwithtooltip";
import { UserERPNextProjectType } from "@/@types/service/erpnext";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<UserERPNextProjectType>;
}

export default function CreateProjectFormStep2({ form }: CreateProjectFormStep2Props) {
  const { control } = form;

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
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
