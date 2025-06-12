import { Toaster as Toast } from "sonner";

export default function Toaster() {
  return (
    <Toast
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-full !px-5 !border-0 !shadow-lg group-[.toaster]:!rounded-full group-[.toaster]:!px-5 group-[.toaster]:!items-center group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:!border-0 group-[.toaster]:shadow-lg",
          title: "!text-sm group-[.toaster]:!text-sm !font-bold group-[.toaster]:!font-bold",
          description: "group-[.toast]:!text-muted-foreground ",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        info: null,
      }}
      visibleToasts={1}
      expand
    />
  );
}
