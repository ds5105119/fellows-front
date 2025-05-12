import React from "react";
import { Button } from "@/components/ui/button";
import { RefCallBack } from "react-hook-form";

interface ToggleButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string;
  ref?: RefCallBack;
}

export default function ToggleButton({ text, type, id, name, value, defaultChecked, checked, onBlur, onChange, onClick, ref }: ToggleButtonProps) {
  return (
    <div className="flex" onClick={onClick}>
      <input
        type={type ?? "checkbox"}
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
        className="peer hidden"
      />

      <Button type="button" variant="default" size="sm" className="hidden peer-checked:inline-block border border-primary">
        <label htmlFor={id} className="flex items-center justify-center w-full h-full">
          {text}
        </label>
      </Button>

      <Button type="button" variant="outline" size="sm" className="inline-block peer-checked:hidden">
        <label htmlFor={id} className="flex items-center justify-center w-full h-full">
          {text}
        </label>
      </Button>
    </div>
  );
}
