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
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AnimatedStack } from "../../components/AnimatedStack";
import { StdButton } from "../../components/StdButton";
import { WhiteBgButton } from "../../components/WhiteBgButton";
import { useRouter } from "next/router";
import { EntityTypes } from "../../components/EntityTypes";

type RegisterUserData = {
  name: string;
  cpf: string;
  email: string;
  cel: string;
  birthDate: string;
  password: string;
  comfirmPassword: string;
  entity: "fisica" | "juridica";
};

type RegisterBancData = {
  accountOwner: string;
  cpf: string;
  banc?: number;
  agency?: number;
  agencyDg?: number;
  accountNumber?: number;
  accountDg?: number;
};

const CadastroIndividual: NextPage = () => {
  const [step, setStep] = useState<number>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultUserData: RegisterUserData = {
    name: "",
    cpf: "",
    email: "",
    cel: "",
    birthDate: "",
    password: "",
    comfirmPassword: "",
    entity: "fisica",
  };

  const defaultBancData: RegisterBancData = {
    accountOwner: "",
    cpf: "",
  };

  const {
    handleSubmit: handleSubmitUser,
    register: registerUser,
    resetField: resetFiledUser,
    watch: watchUser,
    formState: { errors: errorsUser },
  } = useForm<RegisterUserData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaultUserData,
  });

  const {
    handleSubmit: handleSubmitBanc,
    register: registerBanc,
    resetField: resetFiledBanc,
    watch: watchBanc,
    formState: { errors: errorsBanc },
  } = useForm<RegisterBancData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaultBancData,
  });

  const userData = watchUser();
  const bancData = watchBanc();

  const handleSubmit = () => {
    if (step == 1) {
      setStep(2);
    } else {
      setIsLoading(true);
    }
    console.log(userData);
  };

  const options: string[] = ["PESSOA FÍSICA", "PESSOA JURÍDICA"];

  const hadleUserEntityData = (value: string) => {
    value == options[0]
      ? (userData.entity = "fisica")
      : (userData.entity = "juridica");
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "entity",
    defaultValue: defaultUserData.entity == "fisica" ? options[0] : options[1],
    onChange: hadleUserEntityData,
  });

  const group = getRootProps();

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
          maxW="lg"
          px="6"
          pt="14"
          h="fit-content"
          minH="xl"
          as="form"
          onSubmit={handleSubmitUser(handleSubmit)}
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
                <FormControl isRequired id="name">
                  <FormLabel>NOME</FormLabel>
                  <Input
                    {...registerUser("name")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsUser && errorsUser.name && (
                    <FormHelperText>{errorsUser.name.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired id="cpf">
                  <FormLabel>CPF</FormLabel>
                  <Input
                    {...registerUser("cpf")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsUser && errorsUser.cpf && (
                    <FormHelperText>{errorsUser.cpf.message}</FormHelperText>
                  )}
                </FormControl>
              </HStack>
              <FormControl isRequired id="email">
                <FormLabel>E-MAIL</FormLabel>
                <Input
                  {...registerUser("email")}
                  focusBorderColor="green.500"
                  type="email"
                />
                {errorsUser && errorsUser.email && (
                  <FormHelperText>{errorsUser.email.message}</FormHelperText>
                )}
              </FormControl>
              <HStack spacing="5">
                <FormControl isRequired id="cel">
                  <FormLabel>CELULAR</FormLabel>
                  <Input
                    {...registerUser("cel")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsUser && errorsUser.cel && (
                    <FormHelperText>{errorsUser.cel.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired id="birthDate">
                  <FormLabel>DATA DE NASCIMENTO</FormLabel>
                  <Input
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
                <FormControl isRequired id="password">
                  <FormLabel>SENHA</FormLabel>
                  <InputGroup>
                    <Input
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
                <FormControl isRequired id="comfirmPassword">
                  <FormLabel>REPETIR SENHA</FormLabel>
                  <InputGroup>
                    <Input
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
              <HStack {...group}>
                {options.map((value) => {
                  const radio = getRadioProps({ value });
                  return (
                    <EntityTypes key={value} {...radio}>
                      {value}
                    </EntityTypes>
                  );
                })}
              </HStack>
              <FormControl isRequired id="accountOwner">
                <FormLabel>TITULAR DA CONTA</FormLabel>
                <Input
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
              <HStack>
                <FormControl isRequired id="cpf">
                  <FormLabel>CPF</FormLabel>
                  <Input
                    {...registerBanc("cpf")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsBanc && errorsBanc.cpf && (
                    <FormHelperText>{errorsBanc.cpf.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired id="banc">
                  <FormLabel>BANCO</FormLabel>
                  <Input
                    {...registerBanc("banc")}
                    focusBorderColor="green.500"
                    type="number"
                  />
                  {errorsBanc && errorsBanc.banc && (
                    <FormHelperText>{errorsBanc.banc.message}</FormHelperText>
                  )}
                </FormControl>
              </HStack>
            </>
          )}
          <Box width="100%" pt="8">
            <StdButton
              isLoading={isLoading}
              disabled={isLoading}
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
