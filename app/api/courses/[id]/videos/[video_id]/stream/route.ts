import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; video_id: string } }
) {
  const { video_id } = params;

  try {
    const response = await axios.get(
      `${process.env.API_URL}/courses/${params.id}/videos/${video_id}/stream`,
      {
        responseType: "stream",
        headers: {
          "Content-Type": "video/mp4",
        },
      }
    );

    if (response.status === 200) {
      const contentType = response.headers["content-type"] || "video/mp4";
      const contentDisposition =
        response.headers["content-disposition"] ||
        'inline; filename="video.mp4"';

      const stream = response.data;

      return new NextResponse(stream, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
        },
      });
    } else {
      return new NextResponse("Failed to fetch video", {
        status: response.status,
      });
    }
  } catch (error) {
    return new NextResponse("Error fetching video", { status: 500 });
  }
}
