import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const apiUrl = `${process.env.API_URL}/courses`;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "";
  const description = url.searchParams.get("description") || "";
  const page = url.searchParams.get("page") || "1";
  try {
    const response = await axios.get(apiUrl, {
      params: {
        q: {
          title_cont: title,
          description_cont: description,
        },
        page: page,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar os cursos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar o curso" },
      { status: 500 }
    );
  }
}
