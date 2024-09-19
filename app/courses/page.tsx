"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  Box,
  Input,
  Button,
  Stack,
  Divider,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  useBreakpointValue, // Importante para definir o layout com base no tamanho da tela
} from "@chakra-ui/react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Course } from "./[id]/types";
import { convertSecondsToMinutes } from "../helpers/convertSecondsToMinutes";
import { formatDate } from "../helpers/formatDate";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courses`, {
        params: {
          page: page,
          title: filterTitle,
          description: filterDescription,
        },
      });
      setCourses(response.data.courses);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (error) {
      console.error("Erro ao buscar os cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = async () => {
    try {
      const response = await axios.get("/api/courses", {
        params: {
          title: filterTitle,
          description: filterDescription,
        },
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  const handleDelete = async (courseId: number) => {
    try {
      await axios.delete(`/api/courses/${courseId}`);
      await fetchCourses();
      toast({
        title: "Curso excluído.",
        description: "O curso foi excluído com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao excluir curso.",
        description: "Não foi possível excluir o curso. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  console.log(courses);

  const openDeleteModal = (courseId: number) => {
    setCourseToDelete(courseId);
    onOpen();
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  const stackDirection = useBreakpointValue<"row" | "column">({
    base: "column",
    md: "row",
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box padding="6" bg="gray.100" minHeight={"100vh"}>
      <Box mb="8" bg="gray.50" p="6" borderRadius="md" boxShadow="lg">
        <Heading as="h1" mb="6" textAlign="center" color="teal.500">
          Gerenciamento de Cursos
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} spacing="4" mb="5">
          <FormControl>
            <FormLabel>Título</FormLabel>
            <Input
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              bg="white"
              boxShadow="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Input
              value={filterDescription}
              onChange={(e) => setFilterDescription(e.target.value)}
              bg="white"
              boxShadow="sm"
            />
          </FormControl>
        </Stack>

        <Box display="flex" justifyContent="flex-end" width="100%">
          <Stack
            direction={stackDirection}
            spacing="4"
            width={stackDirection === "column" ? "100%" : "auto"} // Ajusta a largura do Stack com base na direção
            alignItems={stackDirection === "column" ? "stretch" : "flex-start"}
          >
            <Button
              colorScheme="teal"
              onClick={handleFilter}
              width={stackDirection === "column" ? "100%" : "auto"} // Define a largura dos botões como auto para telas grandes
            >
              Aplicar Filtros
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => router.push("/courses/new")}
              width={stackDirection === "column" ? "100%" : "auto"} // Define a largura dos botões como auto para telas grandes
            >
              Criar Novo Curso
            </Button>
          </Stack>
        </Box>
      </Box>

      <Divider mb="6" />

      {isMobile ? (
        // Exibição de cartões em dispositivos móveis
        <Stack spacing={4}>
          {courses.length > 0 ? (
            courses.map((course: Course) => (
              <Box
                key={course.id}
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                mb="4"
              >
                <Heading size="md" color="teal.500">
                  {course.title}
                </Heading>
                <Box mt={2}>
                  <b>Descrição:</b> {course.description}
                </Box>
                <Box mt={2}>
                  <b>Tempo de Duração:</b>{" "}
                  {convertSecondsToMinutes(course.total_duration)}
                </Box>
                <Box mt={2}>
                  <b>Data de Término:</b> {formatDate(course.end_date)}
                </Box>
                <Stack mt={4} direction="row" spacing="4">
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    colorScheme="yellow"
                    variant="outline"
                    onClick={() => router.push(`/courses/${course.id}/edit`)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => openDeleteModal(course.id)}
                  >
                    <FaTrash />
                  </Button>
                </Stack>
              </Box>
            ))
          ) : (
            <Box textAlign="center">Nenhum curso encontrado.</Box>
          )}
        </Stack>
      ) : (
        // Exibição de tabela em dispositivos maiores
        <TableContainer bg="white" borderRadius="md" boxShadow="md">
          <Table variant="simple">
            <Thead bg="teal.500">
              <Tr>
                <Th color="white">Título</Th>
                <Th color="white">Descrição</Th>
                <Th color="white">Tempo de Duração</Th>
                <Th color="white">Data de Término</Th>
                <Th color="white">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.length > 0 ? (
                courses.map((course: Course) => (
                  <Tr key={course.id}>
                    <Td>{course.title}</Td>
                    <Td>{course.description}</Td>
                    <Td>{convertSecondsToMinutes(course.total_duration)}</Td>
                    <Td>{formatDate(course.end_date)}</Td>
                    <Td>
                      <Button
                        variant="link"
                        colorScheme="teal"
                        mr="2"
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="link"
                        colorScheme="yellow"
                        mr="2"
                        onClick={() =>
                          router.push(`/courses/${course.id}/edit`)
                        }
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="link"
                        colorScheme="red"
                        onClick={() => openDeleteModal(course.id)}
                      >
                        <FaTrash />
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    Nenhum curso encontrado.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="6"
            p="4"
            bg="white"
            borderRadius="md"
            boxShadow="md"
          >
            <Button
              onClick={() => fetchCourses(currentPage - 1)}
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
              onClick={() => fetchCourses(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              colorScheme="teal"
              variant="solid"
              size="sm"
              ml="2"
            >
              Próxima
            </Button>
          </Box>
        </TableContainer>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            <p>
              Tem certeza de que deseja excluir este curso? Esta ação é
              irreversível.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(courseToDelete!)}
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
