import { Box, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useQuery } from "react-query";
import { AddMaterialModal } from "../../components/materials/AddMaterialModal";
import { MaterialsDataTable } from "../../components/materials/MaterialsDataTable";
import { SidebarWithHeader } from "../../components/SidebarWithHeader";
import { StdButton } from "../../components/StdButton";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { MaterialsRows } from "../../types/MaterialsRows";

type IHandleGetAllUsersProps = {
  queryKey: Array<any>;
};

const Materials: NextPage = () => {
  const { user } = useAuth();

  const [page, setPage] = useState<number>(0); // Current page.
  const [pageSize, setPageSize] = useState<number>(5); // Pagination size.
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query string.

  const { isOpen, onOpen, onClose } = useDisclosure();

  /** ------------------------- Data fetching ---------------------------------- */

  const handleGetAllMaterials = async ({
    queryKey,
  }: IHandleGetAllUsersProps): Promise<MaterialsRows> => {
    const response = await api.get<MaterialsRows>(
      `${queryKey[0]}?page=${queryKey[1]}&pageSize=${queryKey[2]}&searchQuery=${queryKey[3]}`
    );

    return response.data;
  };

  const { data, status } = useQuery(
    ["materials", page, pageSize, searchQuery],
    handleGetAllMaterials,
    { keepPreviousData: true }
  );

  return (
    <Box w="100%" h="100%">
      {isOpen ? <AddMaterialModal isOpen={isOpen} onClose={onClose} /> : false}
      <Head>
        <title>Materiais</title>
      </Head>
      <SidebarWithHeader>
        <Stack
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          mx="10"
          role="materials/stack"
        >
          <Text fontSize={"3xl"} mt={2} mb={6}>
            CADASTRO DE MATERIAIS
          </Text>
          {user?.role === "User" ? (
            false
          ) : (
            <StdButton
              onClick={onOpen}
              w="11rem"
              h="3rem"
              borderRadius="3xl"
              fontSize="0.875rem"
              fontWeight="bold"
            >
              CADASTRAR
            </StdButton>
          )}
        </Stack>
        <MaterialsDataTable
          data={data?.rows ?? []}
          count={data?.count ?? 0}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </SidebarWithHeader>
    </Box>
  );
};

export default Materials;
