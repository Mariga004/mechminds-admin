import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"; // Adjust the import path based on your setup

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    // Await the params since they're now a Promise in newer Next.js versions
    const { storeId } = await params;
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Validate required parameters
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Fetch orders for the customer with the specified email
    const orders = await prismadb.order.findMany({
      where: {
        storeId: storeId, // Use the awaited storeId
        customerEmail: email,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        trackingUpdates: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Check if any orders were found
    if (orders.length === 0) {
      return new NextResponse("No orders found for this customer", { status: 404 });
    }

    // Transform the data to match your frontend interface
    const transformedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      county: order.county,
      customerEmail: order.customerEmail,
      trackingId: order.trackingId,
      deliveryStatus: order.deliveryStatus,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
        },
      })),
      trackingUpdates: order.trackingUpdates.map(update => ({
        id: update.id,
        status: update.status,
        location: update.location,
        note: update.note,
        timestamp: update.timestamp,
      })),
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("[CUSTOMER_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}