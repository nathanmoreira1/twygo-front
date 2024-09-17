import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (id) {
    try {
      const apiUrl = `${process.env.API_URL}/courses`;
      const response = await axios.get(`${apiUrl}/${id}`);
      return NextResponse.json(response.data);
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao buscar o curso" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "ID do curso não fornecido" },
    { status: 400 }
  );
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (id) {
    try {
      const { title, description, start_date, end_date } = await req.json();

      const apiUrl = `${process.env.API_URL}/courses`;
      const response = await axios.put(
        `${apiUrl}/${id}`,
        {
          title,
          description,
          start_date,
          end_date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return NextResponse.json(response.data);
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao atualizar o curso" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "ID do curso não fornecido" },
    { status: 400 }
  );
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (id) {
    try {
      const apiUrl = `${process.env.API_URL}/courses`;
      await axios.delete(`${apiUrl}/${id}`);

      return NextResponse.json(
        { message: "Curso excluído com sucesso" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao excluir o curso" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "ID do curso não fornecido" },
    { status: 400 }
  );
}
