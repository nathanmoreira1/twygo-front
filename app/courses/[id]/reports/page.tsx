"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useBreakpointValue,
  Heading,
  Button,
} from "@chakra-ui/react";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { useRouter } from "next/navigation";
import { Video } from "../types";

import axios from "axios";

// Register the components you need from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function CourseReportsPage({
  params,
}: {
  params: { id: string };
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const reports = [{ name: "Duração dos Vídeos", id: "video-duration" }];
  const [selectedReport, setSelectedReport] = useState(reports[0].id);
  const [videoData, setVideoData] = useState({
    labels: [],
    datasets: [
      {
        label: "Duração dos Vídeos",
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const initialResponse = await axios.get(
          `/api/courses/${params.id}/videos`
        );
        const initialData = initialResponse.data;

        const totalPages = initialData.total_pages || 1;
        const perPage = initialData.per_page || 10;

        const finalResponse = await axios.get(
          `/api/courses/${params.id}/videos`,
          {
            params: {
              per_page: perPage * totalPages,
            },
          }
        );
        const finalData = finalResponse.data;

        const labels = finalData.videos.map((video: Video) => video.title);
        const durations = finalData.videos.map(
          (video: Video) => video.duration
        );

        const totalDuration = durations.reduce(
          (a: number, b: number) => a + b,
          0
        );

        const percentages = durations.map(
          (duration: number) => (duration / totalDuration) * 100
        );

        const backgroundColors = percentages.map(
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        );
        const hoverColors = backgroundColors;

        setVideoData({
          labels: labels,
          datasets: [
            {
              label: "Duração dos Vídeos",
              data: percentages,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: hoverColors,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados dos vídeos:", error);
      }
    };

    if (selectedReport === "video-duration") {
      fetchVideoData();
    }
  }, [selectedReport, params.id]);

  const SidebarContent = () => (
    <VStack as="nav" spacing={4} align="stretch" p={5}>
      <Heading size="md" mb={4}>
        Relatórios
      </Heading>
      {reports.map((report) => (
        <Text
          key={report.id}
          cursor="pointer"
          onClick={() => setSelectedReport(report.id)}
          _hover={{ color: "blue.500" }}
          color={selectedReport === report.id ? "blue.600" : "black"}
        >
          {report.name}
        </Text>
      ))}
    </VStack>
  );

  return (
    <Flex>
      {/* Menu Lateral para telas maiores */}
      {!isMobile && (
        <Box w="250px" bg="gray.100" h="100vh">
          <SidebarContent />
        </Box>
      )}

      {/* Área principal para os relatórios */}
      <Box flex="1" p={6}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={6}
        >
          <Button
            leftIcon={<FaArrowLeft />}
            colorScheme="blue"
            onClick={() => router.push(`/courses/${params.id}`)}
          >
            Voltar para Curso
          </Button>
          {/* Menu lateral como Drawer em dispositivos móveis */}
          {isMobile && (
            <>
              <IconButton
                aria-label="Open menu"
                icon={<FaBars />}
                onClick={onOpen}
              />
              <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                  <SidebarContent />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Box>
        <Heading size="lg" mb={6}>
          {reports.find((report) => report.id === selectedReport)?.name}
        </Heading>
        {selectedReport === "video-duration" ? (
          <Box>
            <Text mb={10}>Gráfico de duração dos vídeos:</Text>
            <Box
              width={{ base: "100%", md: "500px" }}
              height={{ base: "100%", md: "500px" }}
              mx="auto"
            >
              <Pie
                data={videoData}
                options={{
                  plugins: {
                    datalabels: {
                      formatter: (value) => `${value.toFixed(1)}%`,
                      color: "#fff",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        ) : (
          <Text>Selecione um relatório.</Text>
        )}
      </Box>
    </Flex>
  );
}
