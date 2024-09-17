"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  TableContainer,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { Video, Course } from "@/app/courses/[id]/types";

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [videoToDelete, setVideoToDelete] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourseData = async (page: number = 1) => {
    try {
      const [courseResponse, videosResponse] = await Promise.all([
        axios.get<Course>(`/api/courses/${id}`),
        axios.get<{
          videos: Video[];
          total_pages: number;
          current_page: number;
        }>(`/api/courses/${id}/videos`, {
          params: {
            page: page,
          },
        }),
      ]);
      setCourse(courseResponse.data);
      setVideos(videosResponse.data.videos);

      setTotalPages(videosResponse.data.total_pages);
      setCurrentPage(videosResponse.data.current_page);
    } catch (error) {
      setError("Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async (videoId: number) => {
    try {
      await axios.delete(`/api/courses/${id}/videos/${videoId}`);
      await fetchCourseData();
      toast({
        title: "Video excluído.",
        description: "O video foi excluído com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao excluir video.",
        description: "Não foi possível excluir o video. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const openDeleteModal = (videoId: number) => {
    setVideoToDelete(videoId);
    onOpen();
  };

  function convertSecondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    return `${minutes}m ${remainingSeconds}s`;
  }

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
        <Button colorScheme="blue" onClick={() => router.push("/courses")}>
          Voltar
        </Button>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box padding="4" bg="gray.50" borderRadius="md" boxShadow="md">
        <Text>Nenhum curso encontrado.</Text>
        <Button colorScheme="blue" onClick={() => router.push("/courses")}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box padding="4" bg="gray.100" minHeight={"100vh"}>
      <Stack spacing="6">
        <Box borderRadius="md" boxShadow="md" p={4} bg="gray.50">
          <Box display="flex" gap={5} mb={7}>
            <Button colorScheme="blue" onClick={() => router.push("/courses")}>
              Voltar
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => router.push(`/courses/${id}/videos/new`)}
            >
              Nova Aula
            </Button>
            <Button
              colorScheme="yellow"
              onClick={() => router.push(`/courses/${id}/reports`)}
            >
              Relatórios
            </Button>
          </Box>
          <Heading as="h1" mb="4" fontSize="2xl" color="teal.600">
            {course.title}
          </Heading>
          <Text fontSize="lg" mb="2">
            {course.description}
          </Text>
        </Box>

        <Box borderRadius="md" boxShadow="md" p={4} bg="gray.50">
          <Heading as="h2" size="lg" mb="4" color="teal.600">
            Aulas
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead bg="teal.500">
                <Tr>
                  <Th color="white">Nome</Th>
                  <Th color="white">Duração</Th>
                  <Th color="white">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {videos.length > 0 ? (
                  videos.map((video: Video) => (
                    <Tr key={video.id}>
                      <Td>{video.title}</Td>
                      <Td>{convertSecondsToMinutes(video.duration)}</Td>
                      <Td>
                        <Button
                          variant="link"
                          colorScheme="teal"
                          mr="2"
                          onClick={() =>
                            router.push(`/courses/${id}/videos/${video.id}`)
                          }
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="link"
                          colorScheme="yellow"
                          mr="2"
                          onClick={() =>
                            router.push(
                              `/courses/${id}/videos/${video.id}/edit`
                            )
                          }
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="link"
                          colorScheme="red"
                          onClick={() => openDeleteModal(video.id)}
                        >
                          <FaTrash />
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="center">
                      Nenhum vídeo encontrado.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="6"
            p="4"
          >
            <Button
              onClick={() => fetchCourseData(currentPage - 1)}
              isDisabled={currentPage === 1}
              colorScheme="teal"
              variant="solid"
              size="sm"
              mr="2"
            >
              Anterior
            </Button>
            <Box
              px="4"
              py="2"
              bg="gray.50"
              borderRadius="md"
              fontWeight="bold"
              fontSize="md"
              color="gray.700"
            >
              Página {currentPage} de {totalPages}
            </Box>
            <Button
              onClick={() => fetchCourseData(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              colorScheme="teal"
              variant="solid"
              size="sm"
              ml="2"
            >
              Próxima
            </Button>
          </Box>
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            <p>
              Tem certeza de que deseja excluir este vídeo? Esta ação é
              irreversível.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(videoToDelete!)}
            >
              Confirmar
            </Button>
            <Button variant="outline" ml="3" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
