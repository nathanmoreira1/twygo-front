"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Text,
  Divider,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function CreateCoursePage() {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      await axios.post("/api/courses", courseData);
      router.push("/courses");
      toast({
        title: "Curso criado.",
        description: "O curso foi criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setError("Erro ao criar o curso.");
      toast({
        title: "Erro ao criar curso.",
        description: "Não foi possível criar o curso. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

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
            Criar Novo Curso
          </Text>
          <Divider />

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
            <Textarea
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

          <Divider />

          <Button colorScheme="teal" onClick={handleSubmit}>
            Criar Curso
          </Button>
          <Button colorScheme="blue" onClick={() => router.push("/courses")}>
            Voltar para a Lista de Cursos
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
