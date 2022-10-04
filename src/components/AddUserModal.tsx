import InputMask from "react-input-mask";
import React, { useRef, useState } from "react";
import {
  Button,
  Flex,
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
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUserSchema } from "../validations/registerUserSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../services/api";
import { formatCellphone, formatCPF } from "../utils/formatter";
import { WhiteBgButton } from "./WhiteBgButton";
import { registerBancSchema } from "../validations/registerBancSchema";
import { EntityTypes } from "./EntityTypes";
import { User } from "../types/User";
import { Banc } from "../types/Banc";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddUserData = {
  name: string;
  cpf: string;
  email: string;
  cel: string | null;
  birthDate: string;
  role: "Admin" | "User";
  password: string;
  comfirmPassword?: string;
};

type AddBancData = {
  accountOwner: string;
  cpf: string;
  banc?: string;
  agencyNumber?: string;
  agencyDg?: string;
  accountNumber?: string;
  accountDg?: string;
  entity: "fisica" | "juridica";
};

type UsersApiResponse = {
  message: string;
  user?: User;
  banc?: Banc;
};

export const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [step, setStep] = useState<number>(1); // Switch between registration steps.

  const required = true; // Controls the 'isRequired' property of all FormControl components.

  /** ------------------- Form default data -------------------*/

  const defaultUerData: AddUserData = {
    name: "",
    cpf: "",
    email: "",
    cel: null,
    birthDate: "",
    password: "",
    comfirmPassword: "",
    role: "User",
  };

  const defaultBancData: AddBancData = {
    accountOwner: "",
    cpf: "",
    entity: "fisica",
  };

  /** ------------------- useForm Hook -------------------*/

  const {
    register: registerUser,
    handleSubmit,
    watch: watchUser,
    formState: { errors: errorsUser },
  } = useForm<AddUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(registerUserSchema),
    defaultValues: defaultUerData,
  });

  const {
    register: registerBanc,
    resetField: resetFiledBanc,
    watch: watchBanc,
    formState: { errors: errorsBanc },
  } = useForm<AddBancData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(registerBancSchema),
    defaultValues: defaultBancData,
  });

  const userData = watchUser();
  const bancData = watchBanc();

  /** ------------------- Handle Submit -------------------*/

  const handleCreateUser = async (): Promise<UsersApiResponse> => {
    delete userData["comfirmPassword"];
    
    const response: UsersApiResponse = await api.post("/users", {
      userData,
      bancData,
    });

    return response;
  };

  const { status, mutate } = useMutation(handleCreateUser, {
    onSuccess: (response: UsersApiResponse) => {
      toast({
        title: "Sucesso.",
        description: response?.message,
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

  /** ------------------- Custom Radio Input ------------------- */

  const [selectedEntity, setSelectedEntity] = useState<"fisica" | "juridica">(
    defaultBancData.entity
  );

  const options: string[] = ["PESSOA FÍSICA", "PESSOA JURÍDICA"];

  const hadleEntitySlection = (value: string) => {
    value == options[0]
      ? setSelectedEntity("fisica")
      : setSelectedEntity("juridica");
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "entity",
    defaultValue: defaultBancData.entity == "fisica" ? options[0] : options[1],
    onChange: hadleEntitySlection,
  });

  const group = getRootProps();

  /** ----------------------------------------------------------- */

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent w="lg" minW="lg" px="6" py="14" h="fit-content">
        <ModalHeader>Adicionar novo usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            as="form"
            onSubmit={handleSubmit(() => (step == 1 ? setStep(2) : mutate()))}
          >
            {step == 1 ? (
              <>
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
                  <FormControl isRequired={required}>
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
                        {errorsUser.password.message &&
                          errorsUser.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired={required} id="comfirmPassword">
                    <FormLabel>REPETIR SENHA</FormLabel>
                    <InputGroup>
                      <Input
                        isInvalid={
                          errorsUser && errorsUser.comfirmPassword
                            ? true
                            : false
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
              </>
            ) : (
              <>
                <Flex {...group} w="100%" justify="space-between">
                  {options.map((value) => {
                    const radio = getRadioProps({
                      value,
                    });
                    return (
                      <EntityTypes key={value} {...radio}>
                        {value}
                      </EntityTypes>
                    );
                  })}
                </Flex>
                <FormControl isRequired={required} id="accountOwner">
                  <FormLabel>TITULAR DA CONTA</FormLabel>
                  <Input
                    isInvalid={
                      errorsBanc && errorsBanc.accountOwner ? true : false
                    }
                    {...registerBanc("accountOwner")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsBanc && errorsBanc.accountOwner && (
                    <FormHelperText>
                      {errorsBanc.accountOwner.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <HStack spacing="5">
                  <FormControl isRequired={required} id="cpf">
                    <FormLabel>CPF</FormLabel>
                    <Input
                      as={InputMask}
                      mask="999.999.999-99"
                      isInvalid={errorsBanc && errorsBanc.cpf ? true : false}
                      {...registerBanc("cpf")}
                      focusBorderColor="green.500"
                      type="text"
                    />
                    {errorsBanc && errorsBanc.cpf && (
                      <FormHelperText>{errorsBanc.cpf.message}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired={required} id="banc">
                    <FormLabel>BANCO</FormLabel>
                    <Input
                      as={InputMask}
                      mask="9999"
                      isInvalid={errorsBanc && errorsBanc.banc ? true : false}
                      {...registerBanc("banc")}
                      focusBorderColor="green.500"
                      type="text"
                    />
                    {errorsBanc && errorsBanc.banc && (
                      <FormHelperText>{errorsBanc.banc.message}</FormHelperText>
                    )}
                  </FormControl>
                </HStack>
                <HStack spacing="5">
                  <Stack direction="row" flex="1">
                    <FormControl isRequired={required} id="agency" w="100%">
                      <FormLabel>AGÊNCIA</FormLabel>
                      <Input
                        as={InputMask}
                        mask="9999"
                        isInvalid={
                          errorsBanc && errorsBanc.agencyNumber ? true : false
                        }
                        {...registerBanc("agencyNumber")}
                        focusBorderColor="green.500"
                        type="text"
                      />
                      {errorsBanc && errorsBanc.agencyNumber && (
                        <FormHelperText>
                          {errorsBanc.agencyNumber.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl isRequired={required} id="agencyDG" w="6rem">
                      <FormLabel>DV</FormLabel>
                      <Input
                        as={InputMask}
                        mask="999"
                        isInvalid={
                          errorsBanc && errorsBanc.agencyDg ? true : false
                        }
                        {...registerBanc("agencyDg")}
                        focusBorderColor="green.500"
                        type="text"
                      />
                      {errorsBanc && errorsBanc.agencyDg && (
                        <FormHelperText>
                          {errorsBanc.agencyDg.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack direction="row" flex="1">
                    <FormControl isRequired={required} id="accountNumber">
                      <FormLabel>CONTA</FormLabel>
                      <Input
                        as={InputMask}
                        mask="99999999"
                        isInvalid={
                          errorsBanc && errorsBanc.accountNumber ? true : false
                        }
                        {...registerBanc("accountNumber")}
                        focusBorderColor="green.500"
                        type="text"
                      />
                      {errorsBanc && errorsBanc.accountNumber && (
                        <FormHelperText>
                          {errorsBanc.accountNumber.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl isRequired={required} id="accountDg" w="6rem">
                      <FormLabel>DV</FormLabel>
                      <Input
                        as={InputMask}
                        mask="999"
                        isInvalid={
                          errorsBanc && errorsBanc.accountDg ? true : false
                        }
                        {...registerBanc("accountDg")}
                        focusBorderColor="green.500"
                        type="text"
                      />
                      {errorsBanc && errorsBanc.accountDg && (
                        <FormHelperText>
                          {errorsBanc.accountDg.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </HStack>
              </>
            )}

            <HStack style={{ marginTop: "32px" }} justifyContent={"flex-end"}>
              <WhiteBgButton
                mr={3}
                onClick={() => setStep(1)}
                visibility={step == 2 ? "visible" : "hidden"}
              >
                Voltar
              </WhiteBgButton>
              <Button
                ref={initialRef}
                type="submit"
                isLoading={status === "loading"}
                variant="solid"
                _hover={{ filter: "brightness(0.9)" }}
                colorScheme="green"
                borderRadius="lg"
              >
                {step == 1 ? "Continuar" : "Salvar"}
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
