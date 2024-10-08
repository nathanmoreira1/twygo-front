"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import "video.js/dist/video-js.css";
import videojs from "video.js";

export default function CourseVideoPage({
  params,
}: {
  params: { id: string; video_id: string };
}) {
  const id = params.id;
  const video_id = params.video_id;

  const videoRef = useRef(null);

  const router = useRouter();

  const [videoData, setVideoData] = useState<{ title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const response = await fetch(`/api/courses/${id}/videos/${video_id}`);
        if (response.ok) {
          const data = await response.json();
          setVideoData(data);
        } else {
          setError(`Erro ao buscar dados: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Erro ao buscar dados: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoData();
  }, [id, video_id]);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        preload: "auto",
        fluid: true,
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, []);

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

  if (error) {
    return (
      <Box padding="4" bg="gray.50" borderRadius="md" boxShadow="md">
        <Text color="red.500">{error}</Text>
        <Button
          colorScheme="blue"
          onClick={() => router.push(`/courses/${id}`)}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  if (!videoData) {
    return (
      <Box padding="4" bg="gray.50" borderRadius="md" boxShadow="md">
        <Text>Nenhum video encontrado.</Text>
        <Button
          colorScheme="blue"
          onClick={() => router.push(`/courses/${id}`)}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box
      bg="gray.100"
      minHeight={"100vh"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Container
        maxW="container.lg"
        bg="gray.50"
        borderRadius="md"
        boxShadow="md"
        p={4}
      >
        <VStack spacing={4} align="stretch">
          <Box borderRadius="md" boxShadow="md" overflow="hidden">
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              preload="auto"
              playsInline
              width={"100%"}
              height={"auto"}
              style={{ width: "100%", height: "auto" }}
            >
              <source src={`/api/courses/${id}/videos/${video_id}/stream`} />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </Box>
          <Box mt={4}>
            <Heading as="h1" size="lg" mb={2}>
              {videoData?.title}
            </Heading>
            <Text color="gray.600">
              Assista ao vídeo do curso. Você pode usar os controles para
              reproduzir, pausar e ajustar o volume conforme necessário.
            </Text>
            <Text mt={2}>
              <Link
                href={`/api/courses/${id}/videos/${video_id}/stream`}
                color="blue.500"
                isExternal
              >
                Está com problemas para visualizar o vídeo? Clique aqui
              </Link>
            </Text>
          </Box>
          <Box display="flex" justifyContent={"space-between"} mt={4}>
            <Button
              onClick={() => router.push(`/courses/${id}`)}
              colorScheme="orange"
            >
              Voltar para o Curso
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
