import { Box, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { SidebarWithHeader } from "../../components/SidebarWithHeader";
import { StdButton } from "../../components/StdButton";
import { useAuth } from "../../hooks/useAuth";

const Destinies: NextPage = () => {
  const { user } = useAuth();
  return (
    <Box w="100%" h="100%">
      {/* {isOpen ? <AddMaterialModal isOpen={isOpen} onClose={onClose} /> : false} */}
      <Head>
        <title>Destinos</title>
      </Head>
      <SidebarWithHeader>
        <Stack
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          mx="10"
          role="destinies/stack"
        >
          <Text fontSize={"3xl"} mt={2} mb={6}>
            CADASTRO DE DESTINOS
          </Text>
          {user?.role === "User" ? (
            false
          ) : (
            <StdButton
              // onClick={onOpen}
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
        {/* <MaterialsDataTable
          data={data?.rows ?? []}
          count={data?.count ?? 0}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        /> */}
      </SidebarWithHeader>
    </Box>
  );
};

export default Destinies;
