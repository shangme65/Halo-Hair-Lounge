import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const appointmentSchema = z.object({
  serviceId: z.string(),
  productIds: z.array(z.string()).optional(),
  date: z.string(),
  startTime: z.string(),
  notes: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: session.user.id },
      include: {
        service: true,
        products: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    // For public bookings, require customer information
    if (!session?.user) {
      if (
        !validatedData.customerName ||
        !validatedData.customerEmail ||
        !validatedData.customerPhone
      ) {
        return NextResponse.json(
          { error: "Customer information is required for bookings" },
          { status: 400 }
        );
      }
    }

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Calculate end time
    const [hours, minutes] = validatedData.startTime.split(":").map(Number);
    const endMinutes = hours * 60 + minutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMins
    ).padStart(2, "0")}`;

    // Create appointment data - if there's no session, store customer info in notes
    const appointmentData: any = {
      serviceId: validatedData.serviceId,
      date: new Date(validatedData.date),
      startTime: validatedData.startTime,
      endTime: endTime,
      status: "PENDING",
    };

    if (session?.user) {
      appointmentData.userId = session.user.id;
      appointmentData.notes = validatedData.notes;
    } else {
      // For guest bookings, store customer info in notes
      const customerInfo = `Guest Booking\nName: ${validatedData.customerName}\nEmail: ${validatedData.customerEmail}\nPhone: ${validatedData.customerPhone}`;
      appointmentData.notes = validatedData.notes
        ? `${customerInfo}\n\nNotes: ${validatedData.notes}`
        : customerInfo;
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        service: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // If product IDs were provided, create the associations
    if (validatedData.productIds && validatedData.productIds.length > 0) {
      await prisma.appointmentProduct.createMany({
        data: validatedData.productIds.map((productId) => ({
          appointmentId: appointment.id,
          productId: productId,
          quantity: 1,
        })),
      });

      // Fetch the appointment again with products included
      const updatedAppointment = await prisma.appointment.findUnique({
        where: { id: appointment.id },
        include: {
          service: true,
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      // Create notification for admin
      const customerName = session?.user?.name || validatedData.customerName;
      const hasProducts = updatedAppointment?.products.length || 0;

      await prisma.notification.create({
        data: {
          type: "APPOINTMENT",
          title: "New Appointment Booking",
          message: `${customerName} booked ${updatedAppointment?.service.name}${
            hasProducts > 0 ? ` with ${hasProducts} product(s)` : ""
          } for ${new Date(validatedData.date).toLocaleDateString()}`,
          link: "/halo-admin-portal-2024/appointments",
        },
      });

      // Send email notification to admin
      if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
        try {
          const productsList =
            updatedAppointment?.products
              .map((ap) => ap.product.name)
              .join(", ") || "None";

          await sgMail.send({
            to: process.env.ADMIN_EMAIL,
            from: {
              email:
                process.env.SENDGRID_FROM_EMAIL ||
                "noreply@halohair-lounge.site",
              name: "Halo Hair Lounge",
            },
            subject: "🎉 New Appointment Booking",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">New Appointment Booked!</h2>
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${
                  validatedData.customerEmail || session?.user?.email || "N/A"
                }</p>
                <p><strong>Phone:</strong> ${
                  validatedData.customerPhone || "N/A"
                }</p>
                <p><strong>Service:</strong> ${
                  updatedAppointment?.service.name
                }</p>
                <p><strong>Date:</strong> ${new Date(
                  validatedData.date
                ).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${validatedData.startTime}</p>
                <p><strong>Duration:</strong> ${
                  updatedAppointment?.service.duration
                } minutes</p>
                <p><strong>Products:</strong> ${productsList}</p>
                ${
                  validatedData.notes
                    ? `<p><strong>Notes:</strong> ${validatedData.notes}</p>`
                    : ""
                }
                <a href="${
                  process.env.NEXTAUTH_URL
                }/halo-admin-portal-2024/appointments" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 8px;">View Appointment</a>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      }

      return NextResponse.json(
        { appointment: updatedAppointment },
        { status: 201 }
      );
    }

    // Create notification for admin (no products case)
    const customerName = session?.user?.name || validatedData.customerName;

    await prisma.notification.create({
      data: {
        type: "APPOINTMENT",
        title: "New Appointment Booking",
        message: `${customerName} booked ${
          appointment.service.name
        } for ${new Date(validatedData.date).toLocaleDateString()}`,
        link: "/halo-admin-portal-2024/appointments",
      },
    });

    // Send email notification to admin (no products case)
    if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        await sgMail.send({
          to: process.env.ADMIN_EMAIL,
          from: {
            email:
              process.env.SENDGRID_FROM_EMAIL || "noreply@halohair-lounge.site",
            name: "Halo Hair Lounge",
          },
          subject: "🎉 New Appointment Booking",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #16a34a;">New Appointment Booked!</h2>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${
                validatedData.customerEmail || session?.user?.email || "N/A"
              }</p>
              <p><strong>Phone:</strong> ${
                validatedData.customerPhone || "N/A"
              }</p>
              <p><strong>Service:</strong> ${appointment.service.name}</p>
              <p><strong>Date:</strong> ${new Date(
                validatedData.date
              ).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${validatedData.startTime}</p>
              <p><strong>Duration:</strong> ${
                appointment.service.duration
              } minutes</p>
              ${
                validatedData.notes
                  ? `<p><strong>Notes:</strong> ${validatedData.notes}</p>`
                  : ""
              }
              <a href="${
                process.env.NEXTAUTH_URL
              }/halo-admin-portal-2024/appointments" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 8px;">View Appointment</a>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
