import { auth, signIn } from "@/auth";
import AlertMain from "@/components/section/alert/alert-main";

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: "/service/dashboard" });

  return (
    <div className="w-full">
      <div className="w-full h-full md:w-[34rem] md:shadow-[4px_0_10px_rgba(23,37,84,0.07)] bg-zinc-100">
        <AlertMain />
      </div>
    </div>
  );
}
