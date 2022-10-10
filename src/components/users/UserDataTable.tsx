import { useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineSearch,
} from "react-icons/ai";

import { FiSettings } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { User } from "../../types/User";
import { UpdateUserModal } from "./UpdateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
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
  InputLeftElement,
  InputRightElement,
  Flex,
  HStack,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Popover,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { StdButton } from "../StdButton";

type DataTableProps = {
  data: User[];
  count: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  q: string;
  setQ: Dispatch<SetStateAction<string>>;
};

export const UserDataTable = ({
  data,
  count,
  page,
  setPage,
  pageSize,
  setPageSize,
  q,
  setQ,
}: DataTableProps) => {
  const { user } = useAuth();

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

  const [chosenUser, setChosenUser] = useState<User | null>(null);

  const [isSetingsOpen, setIsSetingsOpen] = useState<Boolean[]>([]);
  const settingsElement = useRef<Array<HTMLDivElement>>([]);

  return (
    <>
      {isOpenEditModal && chosenUser ? (
        <UpdateUserModal
          chosenUser={chosenUser}
          isOpen={isOpenEditModal}
          onClose={onCloseEditModal}
        />
      ) : (
        false
      )}
      {isOpenDeleteModal && chosenUser ? (
        <DeleteUserModal
          chosenUser={chosenUser}
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
        />
      ) : (
        false
      )}
      <Box borderRadius="3xl" bg="white" mx="10" my="5">
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
            <InputLeftElement
              pointerEvents="none"
              // eslint-disable-next-line react/no-children-prop
              children={<AiOutlineSearch />}
            />
            <Input
              borderRadius="3xl"
              placeholder="Pesquisar"
              _placeholder={{ color: "gray.400" }}
              color="black"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
            />
            {q?.length > 0 ? (
              <InputRightElement
                onClick={() => {
                  setQ("");
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
                <Th>E-mail</Th>
                <Th>Telefone</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="0.95rem" color="gray.400">
              {data?.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      {new Date(item?.created_at).toLocaleDateString("pt-BR")}
                    </Td>
                    <Td>{item?.name}</Td>
                    <Td>{item?.email}</Td>
                    <Td>{item?.cel}</Td>
                    {user?.role === "Admin" ? (
                      <Td>
                        <Popover placement="right">
                          <HStack spacing="0">
                            <PopoverTrigger>
                              <Button bg="none">
                                <FiSettings />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              border="none"
                              w="fit-content"
                              borderRadius="none"
                            >
                              <Flex flexDir="column">
                                <StdButton
                                  onClick={() => {
                                    setChosenUser(item);
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
                                <Divider />
                                <StdButton
                                  onClick={() => {
                                    setChosenUser(item);
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
                            </PopoverContent>
                          </HStack>
                        </Popover>
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
