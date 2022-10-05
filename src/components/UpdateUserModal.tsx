import React, { useRef, useState } from "react";
import { User } from "../types/User";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import updateUserSchema from "../validations/updateUserSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../services/api";
import { formatCellphone, formatCPF } from "../utils/formatter";

type UpdateUserModalProps = {
  chosenUser: User;
  isOpen: boolean;
  onClose: () => void;
};

type UpdateUserData = {
  name: string;
  cpf: string;
  email: string;
  cel: string | null;
  birthDate: string;
  password?: string | null;
  comfirmPassword?: string | null;
};

export const UpdateUserModal = ({
  chosenUser,
  isOpen,
  onClose,
}: UpdateUserModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const queryClient = useQueryClient();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);

  const required = true; // Controls the 'isRequired' property of all FormControl components.

  const defaultUserData: UpdateUserData = {
    name: chosenUser.name,
    email: chosenUser.email,
    cpf: chosenUser.cpf,
    cel: chosenUser.cel,
    birthDate: chosenUser.birthDate,
    password: null,
    comfirmPassword: null,
  };

  const {
    register: registerUser,
    handleSubmit,
    watch: watchUser,
    formState: { errors: errorsUser },
  } = useForm<UpdateUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(updateUserSchema),
    defaultValues: defaultUserData,
  });

  const userData = watchUser();

  const handleEditUser = async () => {
    let data;
    delete userData["comfirmPassword"];
    if (userData.password === null) {
      delete userData["password"];
      data = userData;
    } else data = userData;

    const response = await api.put(`/users/${chosenUser.id}`, data);

    return response;
  };

  const { status, mutate } = useMutation(handleEditUser, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries("users");
      onClose();
    },
    onError: (e: any) => {
      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(() => mutate())}>
            <HStack>
              <FormControl isRequired={required}>
                <FormLabel>Nome</FormLabel>
                <Input
                  {...registerUser("name")}
                  focusBorderColor={"green.500"}
                  type="text"
                />
                {errorsUser && errorsUser.name && (
                  <FormHelperText>
                    {errorsUser.name.message && errorsUser.name.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl isRequired={required}>
                <FormLabel>CPF</FormLabel>
                <Input
                  {...registerUser("cpf")}
                  focusBorderColor={"green.500"}
                  type="text"
                  value={formatCPF(userData.cpf ? userData.cpf : "")}
                />
                {errorsUser && errorsUser.cpf && (
                  <FormHelperText>
                    {errorsUser.cpf.message && errorsUser.cpf.message}
                  </FormHelperText>
                )}
              </FormControl>
            </HStack>

            <FormControl isRequired={required}>
              <FormLabel>E-mail</FormLabel>
              <Input
                {...registerUser("email")}
                focusBorderColor={"green.500"}
                type="email"
              />
              {errorsUser && errorsUser.email && (
                <FormHelperText>
                  {errorsUser.email.message && errorsUser.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <HStack>
              <FormControl isRequired={required}>
                <FormLabel>CELULAR</FormLabel>
                <Input
                  {...registerUser("cel")}
                  focusBorderColor={"green.500"}
                  type="text"
                  value={formatCellphone(userData.cel ? userData.cel : "")}
                  maxLength={15}
                />
                {errorsUser && errorsUser.cel && (
                  <FormHelperText>
                    {errorsUser.cel.message && errorsUser.cel.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>DATA DE NASCIMENTO</FormLabel>
                <Input
                  {...registerUser("birthDate")}
                  focusBorderColor={"green.500"}
                  type="date"
                  maxLength={15}
                />
                {errorsUser && errorsUser.birthDate && (
                  <FormHelperText>
                    {errorsUser.birthDate.message &&
                      errorsUser.birthDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </HStack>
            <HStack>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    {...registerUser("password")}
                    focusBorderColor={"green.500"}
                    type={isPasswordVisible ? "text" : "password"}
                  />
                  <InputRightElement width={"3.5rem"}>
                    {isPasswordVisible ? (
                      <AiOutlineEye
                        size={24}
                        cursor="pointer"
                        onClick={() => setIsPasswordVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={24}
                        cursor="pointer"
                        onClick={() => setIsPasswordVisible(true)}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
                {errorsUser && errorsUser.password && (
                  <FormHelperText>
                    {errorsUser.password.message && errorsUser.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl id="comfirmPassword">
                <FormLabel>REPETIR SENHA</FormLabel>
                <InputGroup>
                  <Input
                    isInvalid={
                      errorsUser && errorsUser.comfirmPassword ? true : false
                    }
                    {...registerUser("comfirmPassword")}
                    focusBorderColor="green.500"
                    type={isComfirmPasswordVisible ? "text" : "password"}
                  />
                  <InputRightElement width={"3.5rem"}>
                    {isComfirmPasswordVisible ? (
                      <AiOutlineEye
                        size={24}
                        cursor="pointer"
                        onClick={() => setIsComfirmPasswordVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={24}
                        cursor="pointer"
                        onClick={() => setIsComfirmPasswordVisible(true)}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
                {errorsUser && errorsUser.comfirmPassword && (
                  <FormHelperText>
                    {errorsUser.comfirmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>
            </HStack>
            <HStack style={{ marginTop: "32px" }} justifyContent={"flex-end"}>
              <Button mr={3} onClick={onClose}>
                Fechar
              </Button>
              <Button
                ref={initialRef}
                type="submit"
                isLoading={status === "loading"}
                colorScheme="blue"
              >
                Salvar
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
