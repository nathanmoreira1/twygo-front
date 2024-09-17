"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function EditCourseVideoPage({
  params,
}: {
  params: { id: string; video_id: string };
}) {
  const router = useRouter();
  const toast = useToast();

  const { id, video_id } = params;

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          `/api/courses/${id}/videos/${video_id}`
        );
        setCurrentVideo(response.data);
        setTitle(response.data.title);
      } catch (error) {
        setError("Erro ao carregar os dados do vídeo.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id, video_id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setError("Preencha o título.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (videoFile) {
      formData.append("file", videoFile);
    }

    try {
      await axios.put(`/api/courses/${id}/videos/${video_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push(`/courses/${id}`);
      toast({
        title: "Vídeo editado.",
        description: "O vídeo foi editado.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      setError("Erro ao atualizar o vídeo.");
      toast({
        title: "Erro ao editar o vídeo.",
        description: "Não foi possível editar o vídeo. Tente novamente.",
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
            Editar Vídeo do Curso
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

          <FormControl>
            <FormLabel>Anexar Novo Vídeo</FormLabel>
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
              ) : currentVideo ? (
                <Text>{currentVideo.file_name}</Text>
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
            Atualizar Vídeo
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
