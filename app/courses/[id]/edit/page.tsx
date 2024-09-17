"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();

  const { id } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        const course = response.data;
        setTitle(course.title);
        setDescription(course.description);
        setStartDate(course.start_date);
        setEndDate(course.end_date);
      } catch (error) {
        setError("Erro ao carregar os dados do curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleSubmit = async () => {
    if (!title || !description || !startDate || !endDate) {
      setError("Preencha todos os campos.");
      return;
    }

    const courseData = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      await axios.put(`/api/courses/${id}`, courseData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push(`/courses`);
      toast({
        title: "Curso atualizado.",
        description: "O curso foi atualizado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setError("Erro ao atualizar o curso.");
      toast({
        title: "Erro ao atualizar o curso.",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bg="gray.100"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="gray.100"
    >
      <Box
        p={8}
        bg="gray.50"
        borderRadius="md"
        boxShadow="md"
        maxW="600px"
        w="100%"
        mx="auto"
      >
        <Stack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Editar Curso
          </Text>

          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}

          <FormControl isRequired>
            <FormLabel>Título do Curso</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Descrição do Curso</FormLabel>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Data de Início</FormLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Data de Término</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>

          <Button colorScheme="teal" onClick={handleSubmit}>
            Atualizar Curso
          </Button>
          <Button colorScheme="blue" onClick={() => router.push(`/courses`)}>
            Voltar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
