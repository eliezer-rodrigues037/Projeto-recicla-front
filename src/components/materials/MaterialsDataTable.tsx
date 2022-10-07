import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Input,
  IconButton,
  Text,
  Tooltip,
  Select,
  Box,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { FiSettings } from "react-icons/fi";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { MdClear } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { Material } from "../../types/Materials";
import { StdButton } from "../StdButton";
import { DeleteMaterialModal } from "./DeleteMaterialModal";
import { UpdateMaterialModal } from "./UpdateMaterialModal";

type DataTableProps = {
  data: Material[];
  count: number; // Total de usuários
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export const MaterialsDataTable = ({
  data,
  count,
  page,
  setPage,
  pageSize,
  setPageSize,
  searchQuery,
  setSearchQuery,
}: DataTableProps) => {
  const { user } = useAuth();

  const [chosenMaterial, setChosenMaterial] = useState<Material>();

  const {
    isOpen: isOpenEditModal,
    onOpen: OnOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteModal,
    onOpen: OnOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  return (
    <>
      {isOpenEditModal && chosenMaterial ? (
        <UpdateMaterialModal
          chosenMaterial={chosenMaterial}
          isOpen={isOpenEditModal}
          onClose={onCloseEditModal}
        />
      ) : (
        false
      )}
      {isOpenDeleteModal && chosenMaterial ? (
        <DeleteMaterialModal
          chosenMaterial={chosenMaterial}
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
        />
      ) : (
        false
      )}
      <Box borderRadius="3xl" bg="white" mx="10" my="5" minH="lg">
        <Box
          mb={1}
          p={3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputGroup w={{ base: "60%", md: "35%" }} m="1">
            <Input
              borderRadius="3xl"
              placeholder="Pesquisar"
              _placeholder={{ color: "gray.400" }}
              color="black"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
            {searchQuery?.length > 0 ? (
              <InputRightElement
                onClick={() => {
                  setSearchQuery("");
                  setPage(0);
                }}
                // eslint-disable-next-line react/no-children-prop
                children={<MdClear />}
                style={{ cursor: "pointer" }}
              />
            ) : (
              false
            )}
          </InputGroup>
        </Box>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cadastro em</Th>
                <Th>Nome</Th>
                <Th>Preço/Kg</Th>
                <Th>Status</Th>
                <Th>Editar</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="0.95rem" color="gray.400">
              {data?.map((material, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      {new Date(material?.created_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </Td>
                    <Td>{material?.name}</Td>
                    <Td>
                      {Number(material.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Td>
                    <Td>{material.status ? "Ativo" : "Inativo"}</Td>
                    {user?.role === "Admin" ? (
                      <Td>
                        <HStack spacing="0">
                          <Button bg="none" onClick={() => console.log("yo")}>
                            <FiSettings />
                          </Button>
                          <Flex flexDir="column">
                            <StdButton
                              onClick={() => {
                                setChosenMaterial(material);
                                OnOpenEditModal();
                              }}
                              colorScheme="green.500"
                              variant="solid"
                              color="green.500"
                              aria-label="Delete"
                              bg="gray.500"
                              borderRadius="0"
                              fontSize="1rem"
                              w="100%"
                              h="fit-content"
                            >
                              Editar
                            </StdButton>

                            <StdButton
                              onClick={() => {
                                setChosenMaterial(material);
                                OnOpenDeleteModal();
                              }}
                              colorScheme="green.500"
                              variant="solid"
                              color="green.500"
                              aria-label="Delete"
                              bg="gray.500"
                              borderRadius="0"
                              fontSize="1rem"
                              w="100%"
                              h="fit-content"
                            >
                              Deletar
                            </StdButton>
                          </Flex>
                        </HStack>
                      </Td>
                    ) : (
                      false
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {data?.length === 0 ? (
          false
        ) : (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={4}
            gap={2}
            p={4}
            flexWrap={"wrap"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box>
              <Tooltip label="Primeira página">
                <IconButton
                  icon={<HiOutlineChevronDoubleLeft />}
                  aria-label="Previous"
                  mr={2}
                  disabled={page === 0}
                  onClick={() => setPage(0)}
                />
              </Tooltip>
              <Tooltip label="Página anterior">
                <IconButton
                  icon={<HiOutlineChevronLeft />}
                  aria-label="Next"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                />
              </Tooltip>
            </Box>
            <Box gap={1} style={{ display: "flex", alignItems: "center" }}>
              <Text>Página</Text>
              <Text style={{ fontWeight: "bold" }}>
                {page + 1} de {Math.ceil(count / pageSize)}
              </Text>
            </Box>
            <Box gap={2} style={{ display: "flex", alignItems: "center" }}>
              <Text>Linhas por página:</Text>
              <Select
                width={"80px"}
                style={{ cursor: "pointer" }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(+e.target.value);
                  setPage(0);
                }}
              >
                {[5, 10, 25, 50].map((pSize) => {
                  return (
                    <option key={pSize} value={pSize}>
                      {pSize}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box>
              <Tooltip label="Próxima página">
                <IconButton
                  disabled={page + 1 === Math.ceil(count / pageSize)}
                  icon={<HiOutlineChevronRight />}
                  aria-label="Previous"
                  mr={2}
                  onClick={() => setPage(page + 1)}
                />
              </Tooltip>
              <Tooltip label="Última página">
                <IconButton
                  disabled={page + 1 === Math.ceil(count / pageSize)}
                  icon={<HiOutlineChevronDoubleRight />}
                  aria-label="Next"
                  onClick={() => setPage(Math.ceil(count / pageSize) - 1)}
                />
              </Tooltip>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
