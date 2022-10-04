import Head from "next/head";
import router from "next/router";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatedStack } from "../../components/AnimatedStack";
import { registerBancSchema } from "../../validations/registerBancSchema";
import { registerCropUserSchema } from "../../validations/registerCropUserSchema";
import { StdButton } from "../../components/StdButton";
import { WhiteBgButton } from "../../components/WhiteBgButton";
import { EntityTypes } from "../../components/EntityTypes";

type RegisterCropUserData = {
  socialReason: string;
  fantasyName: string;
  cnpj: string;
  email: string;
  activityType: string;
  password: string;
  comfirmPassword: string;
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

const CadastroCorporativo: NextPage = () => {
  const [step, setStep] = useState<number>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const required = true; // controla a booleana 'required' de todos os forms.

  const defaultUserData: RegisterCropUserData = {
    socialReason: "",
    fantasyName: "",
    email: "",
    cnpj: "",
    activityType: "",
    password: "",
    comfirmPassword: "",
  };

  const defaultBancData: RegisterBancData = {
    accountOwner: "",
    cpf: "",
    entity: "fisica",
  };

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

  /** ------------------- useForm Hook ------------------- */

  const {
    handleSubmit: handleSubmitUser,
    register: registerUser,
    watch: watchUser,
    formState: { errors: errorsCropUser },
  } = useForm<RegisterCropUserData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(registerCropUserSchema),
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

  const handleSubmit = () => {
    if (step == 2) {
      setIsLoading(true);
      bancData.entity = selectedEntity;
      !Object.values(userData).some((x) => x === null || x === "") &&
      !Object.values(bancData).some((x) => x === null || x === "")
        ? toast({
            title: "Sucesso.",
            description:
              "User: " +
              JSON.stringify(userData, null, " ") +
              " " +
              "Banc:  " +
              JSON.stringify(bancData, null, " "),
            status: "success",
            duration: 2500,
            isClosable: true,
            position: "top",
          })
        : toast({
            title: "Erro.",
            description:
              "User: " +
              JSON.stringify(userData, null, " ") +
              " " +
              "Banc:  " +
              JSON.stringify(bancData, null, " "),
            status: "error",
            duration: 10000,
            isClosable: true,
            position: "top",
          });

      setIsLoading(false);
      setTimeout(devRouterPush, 5000);
    } else {
      setStep(2);
    }
  };

  const devRouterPush = () => {
    router.push("/");
  };

  const userData = watchUser();
  const bancData = watchBanc();

  const toast = useToast();

  return (
    <>
      <Head>
        <title>Cadastro | Corporativo</title>
      </Head>
      <AnimatedStack
        role="Register-corporative/stack"
        minH="100vh"
        minW="80%"
        mx="20"
        justify="center"
        align="center"
      >
        <Flex display={["none", "none", "flex"]}>
          <Image
            src="/static/images/tablet-login-corporativo.png"
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
            PERFIL CORPORATIVO
          </Heading>
          {step == 1 ? (
            <>
              <VStack align="space-between" spacing="2">
                <HStack spacing="5">
                  <FormControl isRequired={required} id="socialReason">
                    <FormLabel>RAZAÕ SOCIAL</FormLabel>
                    <Input
                      isInvalid={
                        errorsCropUser && errorsCropUser.socialReason
                          ? true
                          : false
                      }
                      {...registerUser("socialReason")}
                      focusBorderColor="green.500"
                      type="text"
                    />
                    {errorsCropUser && errorsCropUser.socialReason && (
                      <FormHelperText>
                        {errorsCropUser.socialReason.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired={required} id="fantasyName">
                    <FormLabel>NOME FANTASIA</FormLabel>
                    <Input
                      isInvalid={
                        errorsCropUser && errorsCropUser.fantasyName
                          ? true
                          : false
                      }
                      {...registerUser("fantasyName")}
                      focusBorderColor="green.500"
                      type="text"
                    />
                    {errorsCropUser && errorsCropUser.fantasyName && (
                      <FormHelperText>
                        {errorsCropUser.fantasyName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </HStack>
                <HStack spacing="5">
                  <FormControl isRequired={required} id="cnpj">
                    <FormLabel>CNPJ</FormLabel>
                    <Input
                      as={InputMask}
                      mask="99.999.999/0009-99"
                      isInvalid={
                        errorsCropUser && errorsCropUser.cnpj ? true : false
                      }
                      {...registerUser("cnpj")}
                      focusBorderColor="green.500"
                      type="text"
                    />
                    {errorsCropUser && errorsCropUser.cnpj && (
                      <FormHelperText>
                        {errorsCropUser.cnpj.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired={required} id="email">
                    <FormLabel>E-MAIL</FormLabel>
                    <Input
                      isInvalid={
                        errorsCropUser && errorsCropUser.email ? true : false
                      }
                      {...registerUser("email")}
                      focusBorderColor="green.500"
                      type="email"
                    />
                    {errorsCropUser && errorsCropUser.email && (
                      <FormHelperText>
                        {errorsCropUser.email.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </HStack>

                <FormControl isRequired={required} id="activityType">
                  <FormLabel>TIPO DE ATIVIDADE</FormLabel>
                  <Input
                    isInvalid={
                      errorsCropUser && errorsCropUser.activityType
                        ? true
                        : false
                    }
                    {...registerUser("activityType")}
                    focusBorderColor="green.500"
                    type="text"
                  />
                  {errorsCropUser && errorsCropUser.activityType && (
                    <FormHelperText>
                      {errorsCropUser.activityType.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <HStack spacing="5">
                  <FormControl isRequired={required} id="password">
                    <FormLabel>SENHA</FormLabel>
                    <InputGroup>
                      <Input
                        isInvalid={
                          errorsCropUser && errorsCropUser.password
                            ? true
                            : false
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
                    {errorsCropUser && errorsCropUser.password ? (
                      <FormHelperText lineHeight="normal">
                        {errorsCropUser.password.message}
                      </FormHelperText>
                    ) : (
                      <FormHelperText lineHeight="normal">
                        &nbsp;
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired={required} id="comfirmPassword">
                    <FormLabel>REPETIR SENHA</FormLabel>
                    <InputGroup>
                      <Input
                        isInvalid={
                          errorsCropUser && errorsCropUser.comfirmPassword
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
                    {errorsCropUser && errorsCropUser.comfirmPassword ? (
                      <FormHelperText>
                        {errorsCropUser.comfirmPassword.message}
                      </FormHelperText>
                    ) : (
                      <FormHelperText lineHeight="normal">
                        &nbsp;
                      </FormHelperText>
                    )}
                  </FormControl>
                </HStack>
              </VStack>
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

export default CadastroCorporativo;
