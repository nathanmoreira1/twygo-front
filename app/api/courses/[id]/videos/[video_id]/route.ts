import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; video_id: string } }
) {
  const { id, video_id } = params;

  try {
    const response = await axios.get(
      `${process.env.API_URL}/courses/${id}/videos/${video_id}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      return new NextResponse(JSON.stringify(response.data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse("Failed to fetch video details", {
        status: response.status,
      });
    }
  } catch (error) {
    return new NextResponse("Error fetching video details", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; video_id: string } }
) {
  const { id, video_id } = params;

  try {
    const formData = await req.formData();

    const response = await axios.put(
      `${process.env.API_URL}/courses/${id}/videos/${video_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      return new NextResponse(JSON.stringify(response.data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse("Failed to update video", {
        status: response.status,
      });
    }
  } catch (error) {
    return new NextResponse("Error updating video", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; video_id: string } }
) {
  const { id, video_id } = params;

  try {
    const response = await axios.delete(
      `${process.env.API_URL}/courses/${id}/videos/${video_id}`
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    } else {
      return new NextResponse("Failed to delete video", {
        status: response.status,
      });
    }
  } catch (error) {
    return new NextResponse("Error deleting video", { status: 500 });
  }
}
