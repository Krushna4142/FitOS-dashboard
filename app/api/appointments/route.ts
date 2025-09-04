import { NextResponse } from "next/server"

const generateAppointments = () => {
  const appointments = [
    {
      id: 1,
      title: "Annual Physical",
      doctor: "Dr. Sarah Johnson",
      specialty: "General Practice",
      date: "2024-01-15",
      time: "10:30 AM",
      location: "Main Medical Center",
      address: "123 Health St, Medical District",
      type: "General Checkup",
      status: "confirmed",
      notes: "Bring previous lab results",
    },
    {
      id: 2,
      title: "Dental Cleaning",
      doctor: "Dr. Mike Chen",
      specialty: "Dentistry",
      date: "2024-01-22",
      time: "2:00 PM",
      location: "Smile Dental Clinic",
      address: "456 Dental Ave, Downtown",
      type: "Dental",
      status: "confirmed",
      notes: "Regular 6-month cleaning",
    },
    {
      id: 3,
      title: "Eye Exam",
      doctor: "Dr. Lisa Park",
      specialty: "Ophthalmology",
      date: "2024-02-05",
      time: "11:15 AM",
      location: "Vision Care Center",
      address: "789 Eye Care Blvd, Uptown",
      type: "Vision",
      status: "pending",
      notes: "Annual vision screening",
    },
    {
      id: 4,
      title: "Cardiology Follow-up",
      doctor: "Dr. Robert Kim",
      specialty: "Cardiology",
      date: "2024-02-12",
      time: "9:00 AM",
      location: "Heart Health Institute",
      address: "321 Cardiac Way, Medical Center",
      type: "Specialist",
      status: "confirmed",
      notes: "Review recent EKG results",
    },
  ]

  return appointments
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    appointments: generateAppointments(),
    success: true,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 600))

  return NextResponse.json({
    success: true,
    message: "Appointment scheduled successfully",
    appointment: {
      id: Date.now(),
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  })
}

export async function PUT(request: Request) {
  const body = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 400))

  return NextResponse.json({
    success: true,
    message: "Appointment updated successfully",
    appointment: body,
  })
}
