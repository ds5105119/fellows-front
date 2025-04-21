import FiscalSection from "@/components/section/fiscal";
import Footer from "@/components/footer/footer";

export default async function Page({ params }: { params: Promise<{ year: string; code: string }> }) {
  const { year, code } = await params;
  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="flex w-full flex-col justify-start space-y-6 px-8 mt-6">
        <FiscalSection year={year} code={code} />
      </div>
      <Footer />
    </div>
  );
}
