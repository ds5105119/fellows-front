"use client";

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { categorizedFeatures } from "@/components/resource/project";
import { ProjectInfoSchemaType } from "@/@types/service/project";
import { FeatureItemWithTooltip } from "@/components/section/service/project/new/featureitemwithtooltip";

interface CreateProjectFormStep2Props {
  form: UseFormReturn<ProjectInfoSchemaType>;
  feature: string[];
  handleFeatureButtonClick: (value: string) => void;
  handleFeatureChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CreateProjectFormStep2({ form, feature, handleFeatureButtonClick, handleFeatureChange }: CreateProjectFormStep2Props) {
  const { control } = form;

  return (
    <>
      <FormField
        control={control}
        name="feature_list"
        render={() => (
          <FormItem>
            <div className="w-full flex flex-col gap-5">
              {categorizedFeatures.map((category) => (
                <div key={category.title} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="col-span-full text-sm font-medium mb-1">{category.title}</div>
                  {category.items.map((item) => (
                    <FeatureItemWithTooltip key={item.title} item={item} isChecked={feature.includes(item.title)} onButtonClick={handleFeatureButtonClick} />
                  ))}
                </div>
              ))}
            </div>
            <Textarea
              className="text-base font-semibold focus-visible:ring-0 rounded-2xl bg-gray-100 border-0 px-6 py-4 min-h-36 mt-6"
              placeholder="혹시 더 필요한 기능이 있다면 적어주세요."
              value={
                feature
                  .find((f) => f.startsWith("기타:"))
                  ?.replace("기타:", "")
                  .trim() || ""
              }
              onChange={handleFeatureChange}
              rows={3}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
