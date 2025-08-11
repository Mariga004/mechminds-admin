import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }> // Updated type to Promise
}) {
   const { userId } = auth();

   if (!userId) {
    redirect('/');
   }

   // Await the params before using its properties
   const { storeId } = await params;

   const store = await prismadb.store.findFirst({
    where: {
        id: storeId, // Now using the awaited storeId
        userId
    }
   });

   if(!store) {
    redirect('/');
   }

   return (
    <>
    <Navbar />
    {children}
    </>
   );
};