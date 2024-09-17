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
} from "@chakra-ui/react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  }, []);

  const handleFilter = async () => {
    try {
      const response = await axios.get("/api/courses", {
        params: {
          title: filterTitle,
          description: filterDescription,
        },
      });
      setCourses(response.data);
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

  const openDeleteModal = (courseId: number) => {
    setCourseToDelete(courseId);
    onOpen();
  };

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
      {/* Filtro de Cursos */}
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

        <Box display="flex" justifyContent="flex-end">
          <Stack direction="row" spacing="4">
            <Button colorScheme="teal" onClick={handleFilter}>
              Aplicar Filtros
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => router.push("/courses/new")}
            >
              Criar Novo Curso
            </Button>
          </Stack>
        </Box>
      </Box>

      <Divider mb="6" />

      <TableContainer bg="white" borderRadius="md" boxShadow="md">
        <Table variant="simple">
          <Thead bg="teal.500">
            <Tr>
              <Th color="white">Título</Th>
              <Th color="white">Descrição</Th>
              <Th color="white">Data de Criação</Th>
              <Th color="white">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {courses.length > 0 ? (
              courses.map(
                (course: {
                  id: number;
                  title: string;
                  description: string;
                  created_at: string;
                }) => (
                  <Tr key={course.id}>
                    <Td>{course.title}</Td>
                    <Td>{course.description}</Td>
                    <Td>{new Date(course.created_at).toLocaleDateString()}</Td>
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
                )
              )
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
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
