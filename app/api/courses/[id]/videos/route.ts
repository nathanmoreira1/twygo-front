import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do curso não fornecido" },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("per_page") || "10";

  try {
    const apiUrl = `${process.env.API_URL}/courses`;
    const response = await axios.get(`${apiUrl}/${id}/videos`, {
      params: {
        page: page,
        per_page: perPage,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar vídeos do curso" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do curso não fornecido" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const videoFile = formData.get("video");
    const title = formData.get("title");

    if (!videoFile || !title) {
      return NextResponse.json(
        { error: "Título e vídeo são obrigatórios" },
        { status: 400 }
      );
    }

    const apiUrl = `${process.env.API_URL}/courses/${id}/videos`;

    const payload = new FormData();
    payload.append("file", videoFile);
    payload.append("title", title);

    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao enviar o vídeo" },
      { status: 500 }
    );
  }
}
