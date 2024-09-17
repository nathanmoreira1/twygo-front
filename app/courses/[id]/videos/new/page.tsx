"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function NewCourseVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const id = params.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !videoFile) {
      setError("Preencha o título e selecione um vídeo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    formData.append("course_id", id as string);

    try {
      await axios.post(`/api/courses/${id}/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push(`/courses/${id}`);
      toast({
        title: "Vídeo adicionado.",
        description: "O vídeo foi adicionado ao curso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setError("Erro ao enviar o vídeo.");
      toast({
        title: "Erro ao adicionar o vídeo.",
        description: "Não foi possível adicionar o vídeo. Tente novamente.",
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
            Adicionar Novo Vídeo ao Curso
          </Text>

          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}

          <FormControl isRequired>
            <FormLabel>Título do Vídeo</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Anexar Vídeo</FormLabel>
            <Box
              display="flex"
              alignItems="center"
              border="1px"
              borderColor="gray.300"
              borderRadius="md"
              p={2}
              cursor="pointer"
              _hover={{ borderColor: "gray.400" }}
              onClick={() => document.getElementById("video-upload")?.click()}
            >
              <Button as="span" variant="outline" colorScheme="teal" mr={4}>
                Escolher Vídeo
              </Button>
              {videoFile ? (
                <Text>{videoFile.name}</Text>
              ) : (
                <Text color="gray.500">Nenhum arquivo selecionado</Text>
              )}
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                display="none"
              />
            </Box>
          </FormControl>

          <Button colorScheme="teal" onClick={handleSubmit}>
            Enviar Vídeo
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => router.push(`/courses/${id}`)}
          >
            Voltar para o Curso
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
