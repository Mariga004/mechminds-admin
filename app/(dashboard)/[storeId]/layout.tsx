import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
   const { userId } = await auth();

   if (!userId) {
    redirect('/');
   }

   const store = await prismadb.store.findFirst({
    where: {
        id: params.storeId,
        userId
    }
   });

   if(!store) {
    redirect('/');
   }

   return (
    <>
            {/* <NextTopLoader
              color="#3b82f6" // Default blue - change to match your theme
              height={3}
              showSpinner={false}
              shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
            /> */}
    <Navbar />
    {children}
    </>
   );
};