import Head from "next/head";
import InputMask from "react-input-mask";
import {
  Flex,
  Image,
  VStack,
  Text,
  FormControl,
  Heading,
  FormLabel,
  Input,
  FormHelperText,
  HStack,
  InputRightElement,
  InputGroup,
  useRadioGroup,
  Box,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AnimatedStack } from "../../components/AnimatedStack";
import { StdButton } from "../../components/StdButton";
import { WhiteBgButton } from "../../components/WhiteBgButton";
import { EntityTypes } from "../../components/EntityTypes";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUserSchema } from "../../validations/registerUserSchema";
import { registerBancSchema } from "../../validations/registerBancSchema";
import api from "../../services/api";

type RegisterUserData = {
  name: string;
  cpf: string;
  email: string;
  cel: string;
  birthDate: string;
  password: string;
  comfirmPassword?: string;
};

type RegisterBancData = {
  accountOwner: string;
  cpf: string;
  banc?: string;
  agencyNumber?: string;
  agencyDg?: string;
  accountNumber?: string;
  accountDg?: string;
  entity: "fisica" | "juridica";
};

const CadastroIndividual: NextPage = () => {
  const [step, setStep] = useState<number>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const required = true;

  const defaultUserData: RegisterUserData = {
    name: "",
    cpf: "",
    email: "",
    cel: "",
    birthDate: "",
    password: "",
    comfirmPassword: "",
  };

  const defaultBancData: RegisterBancData = {
    accountOwner: "",
    cpf: "",
    entity: "fisica",
  };

  const [selectedEntity, setSelectedEntity] = useState<"fisica" | "juridica">(
    defaultBancData.entity
  );

  /** ------------------- useForm Hook -------------------*/

  const {
    handleSubmit: handleSubmitUser,
    register: registerUser,
    resetField: resetFiledUser,
    watch: watchUser,
    formState: { errors: errorsUser },
  } = useForm<RegisterUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(registerUserSchema),
    defaultValues: defaultUserData,
  });

  const {
    register: registerBanc,
    resetField: resetFiledBanc,
    watch: watchBanc,
    formState: { errors: errorsBanc },
  } = useForm<RegisterBancData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(registerBancSchema),
    defaultValues: defaultBancData,
  });

  const userData = watchUser();
  const bancData = watchBanc();

  /** ------------------- Handle Submit -------------------*/

  const handleSubmit = async () => {
    if (step == 2) {
      setIsLoading(true);
      bancData.entity = selectedEntity;
      console.log(bancData);
      console.log(userData);

      delete userData["comfirmPassword"];

      const response = await api.post("auth/register", {
        userData,
        bancData,
      });

      return response;
    }
  };

  /** ------------------- Custom Radio Input ------------------- */

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

  /** ------------------- useMutation Hook -------------------*/

  const toast = useToast();

  const { status: statusRegister, mutate: mutateRegister } = useMutation(
    handleSubmit,
    {
      onSuccess: () => {
        setIsLoading(false);
        toast({
          title: "Sucesso.",
          description: "Cadastrado com sucesso!",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        router.push("/");
      },
      onError: (e: any) => {
        setIsLoading(false);
        toast({
          title: "Erro.",
          description: e.response.data.message,
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      },
    }
  );

  return (
    <>
      <Head>
        <title>Cadastro | Individual</title>
      </Head>
      <AnimatedStack
        role="Register-individual/stack"
        minH="100vh"
        minW="80%"
        mx="20"
        justify="center"
        align="center"
      >
        <Flex display={["none", "none", "flex"]}>
          <Image
            src="/static/images/mobile-login-individual.png"
            alt="Image of two peple pointing to form."
            boxSize="lg"
          />
        </Flex>
        <VStack
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          w="lg"
          minW="lg"
          px="6"
          pt="14"
          h="fit-content"
          as="form"
          onSubmit={handleSubmitUser(() => {
            step == 1 ? setStep(2) : mutateRegister();
          })}
        >
          <Text
            color="gray.400"
            fontSize="xl"
            fontWeight="bold"
            alignSelf="start"
            lineHeight="7"
          >
            {step == 1 ? "Informe seus dados" : "Estamos quase lá..."}
          </Text>
          <Heading
            alignSelf="start"
            fontWeight="semibold"
            fontSize="4xl"
            lineHeight="10"
            pb="1.65rem"
          >
            PERFIL INDIVIDUAL
          </Heading>
          {step == 1 ? (
            <VStack align="space-between" spacing="2">
              <HStack spacing="5">
                <FormControl isRequired={required} id="name">
                  <FormLabel>NOME</FormLabel>
                  <Input
                    isInvalid={errorsUser && errorsUser.name ? true : false}
                    {...registerUser("name")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsUser && errorsUser.name && (
                    <FormHelperText>{errorsUser.name.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired={required} id="cpf">
                  <FormLabel>CPF</FormLabel>
                  <Input
                    as={InputMask}
                    mask="999.999.999-99"
                    isInvalid={errorsUser && errorsUser.cpf ? true : false}
                    {...registerUser("cpf")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsUser && errorsUser.cpf && (
                    <FormHelperText>{errorsUser.cpf.message}</FormHelperText>
                  )}
                </FormControl>
              </HStack>
              <FormControl isRequired={required} id="email">
                <FormLabel>E-MAIL</FormLabel>
                <Input
                  isInvalid={errorsUser && errorsUser.email ? true : false}
                  {...registerUser("email")}
                  focusBorderColor="green.500"
                  type="email"
                />
                {errorsUser && errorsUser.email && (
                  <FormHelperText>{errorsUser.email.message}</FormHelperText>
                )}
              </FormControl>
              <HStack spacing="5">
                <FormControl isRequired={required} id="cel">
                  <FormLabel>CELULAR</FormLabel>
                  <Input
                    isInvalid={errorsUser && errorsUser.cel ? true : false}
                    as={InputMask}
                    mask="(99) 99999-9999"
                    {...registerUser("cel")}
                    focusBorderColor="green.500"
                    type="phone"
                  />
                  {errorsUser && errorsUser.cel && (
                    <FormHelperText>{errorsUser.cel.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired={required} id="birthDate">
                  <FormLabel>DATA DE NASCIMENTO</FormLabel>
                  <Input
                    isInvalid={
                      errorsUser && errorsUser.birthDate ? true : false
                    }
                    {...registerUser("birthDate")}
                    focusBorderColor="green.500"
                    type="date"
                  />
                  {errorsUser && errorsUser.birthDate && (
                    <FormHelperText>
                      {errorsUser.birthDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </HStack>
              <HStack spacing="5">
                <FormControl isRequired={required} id="password">
                  <FormLabel>SENHA</FormLabel>
                  <InputGroup>
                    <Input
                      isInvalid={
                        errorsUser && errorsUser.password ? true : false
                      }
                      {...registerUser("password")}
                      focusBorderColor="green.500"
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
                      {errorsUser.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired={required} id="comfirmPassword">
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
            </VStack>
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
          <Box width="100%" pt="8">
            <StdButton
              isLoading={statusRegister === "loading" || isLoading}
              disabled={statusRegister === "loading" || isLoading}
              type="submit"
              width="100%"
            >
              {step == 1 ? "CONTINUAR" : "CADASTRAR"}
            </StdButton>
          </Box>
          <Box pt="8" pb="5">
            <WhiteBgButton
              onClick={
                step == 1 ? () => router.push("/register") : () => setStep(1)
              }
            >
              VOLTAR
            </WhiteBgButton>
          </Box>
        </VStack>
      </AnimatedStack>
    </>
  );
};

export default CadastroIndividual;
