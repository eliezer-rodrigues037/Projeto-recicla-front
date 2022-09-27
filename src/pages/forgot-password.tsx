import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Image,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import forgotSchema from "../validations/forgotSchema";
import resetPasswordSchema from "../validations/resetPasswordSchema";
import { useMutation } from "react-query";
import { StdButton } from "../components/StdButton";
import { WhiteBgButton } from "../components/WhiteBgButton";
import { AnimatedStack } from "../components/AnimatedStack";

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  newPassword: string;
  passwordConfirmation: string;
};

const ForgotPassword: NextPage = () => {
  const toast = useToast();
  const router = useRouter();

  const [isTokenSent, setIsTokenSent] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isComfirmPasswordVisible, setIsComfirmPasswordVisible] =
    useState<boolean>(false);

  const defaultValuesForgot: ForgotPasswordData = {
    email: "",
  };

  const defaultValuesReset: ResetPasswordData = {
    token: "",
    newPassword: "",
    passwordConfirmation: "",
  };

  const {
    handleSubmit: handleSubmitForgot,
    register: registerForgot,
    resetField: resetFieldForgot,
    watch: watchForgot,
    formState: { errors: errorsForgot },
  } = useForm<ForgotPasswordData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(forgotSchema),
    defaultValues: defaultValuesForgot,
  });

  const {
    register: registerReset,
    watch: watchReset,
    formState: { errors: errorsReset },
  } = useForm<ResetPasswordData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: defaultValuesReset,
  });

  const valuesForgot = watchForgot();
  const valuesReset = watchReset();

  const handleSendRecoverToken = async () => {
    const response = await api.post("/auth/forgot", {
      email: valuesForgot.email,
    });

    return response;
  };

  const handleResetPassword = async () => {
    const data = {
      email: valuesForgot.email,
      token: valuesReset.token.replaceAll("-", ""),
      password: valuesReset.newPassword,
    };

    const response = await api.post("/auth/reset", data);

    return response;
  };

  const { status: statusRecover, mutate: mutateRecover } = useMutation(
    handleSendRecoverToken,
    {
      onSuccess: () => {
        setIsTokenSent(true);
        toast({
          title: "Sucesso.",
          description: "Token enviado!",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      },
      onError: () => {
        setIsTokenSent(false);
        toast({
          title: "Erro.",
          description: "Erro ao enviar token!",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        resetFieldForgot("email");
      },
    }
  );

  const { status: statusReset, mutate: mutateReset } = useMutation(
    handleResetPassword,
    {
      onSuccess: () => {
        toast({
          title: "Sucesso.",
          description: "Nova senha cadastrada!",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        router.push("/");
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
    }
  );

  return (
    <>
      <Head>
        <title>Recuperação de senha</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatedStack
        minH="100vh"
        minW="80%"
        mx="20"
        role="forgot-password/stack"
        justify="center"
      >
        <Flex align="center" display={["none", "none", "flex"]}>
          <Image
            alt="Forgot newPassword Image"
            boxSize="xl"
            src="/static/images/forgotPassword.png"
          />
        </Flex>
        <Flex align={"center"} justify={"center"}>
          <Stack
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            as="form"
            onSubmit={handleSubmitForgot(() => {
              isTokenSent ? mutateReset() : mutateRecover();
            })}
            w={"full"}
            maxW={"md"}
            px="6"
          >
            <Heading fontSize="3xl" mt="16" mb="10">
              RECUPERAÇÃO DE SENHA
            </Heading>
            {isTokenSent ? (
              <>
                <FormControl isRequired id="token">
                  <FormLabel color="gray.400" fontSize="sm">
                    CÓDIGO
                  </FormLabel>
                  <Input
                    {...registerReset("token")}
                    focusBorderColor={"green.500"}
                    type="text"
                    maxLength={8}
                  />
                  {errorsReset && errorsReset.token && (
                    <FormHelperText>
                      {errorsReset.token.message && errorsReset.token.message}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl isRequired id="newPassword">
                  <FormLabel color="gray.400" fontSize="sm">
                    SENHA
                  </FormLabel>
                  <InputGroup>
                    <Input
                      {...registerReset("newPassword")}
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
                  {errorsReset && errorsReset.newPassword && (
                    <FormHelperText>
                      {errorsReset.newPassword.message &&
                        errorsReset.newPassword.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired id="passwordConfirmation">
                  <FormLabel color="gray.400" fontSize="sm">
                    REPETIR SENHA
                  </FormLabel>
                  <InputGroup>
                    <Input
                      {...registerReset("passwordConfirmation")}
                      focusBorderColor={"green.500"}
                      type={isComfirmPasswordVisible ? "text" : "password"}
                    ></Input>
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
                  {errorsReset && errorsReset.passwordConfirmation && (
                    <FormHelperText>
                      {errorsReset.passwordConfirmation.message &&
                        errorsReset.passwordConfirmation.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            ) : (
              <FormControl isRequired id="email" pt="12" pb="12">
                <FormLabel color="gray.400" fontSize="sm">
                  E-mail
                </FormLabel>
                <Input
                  {...registerForgot("email")}
                  focusBorderColor={"green.500"}
                  type="email"
                />
                {errorsForgot && errorsForgot.email && (
                  <FormHelperText>
                    {errorsForgot.email.message && errorsForgot.email.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
            <Flex>
              <StdButton
                flex={1}
                mt="10"
                type="submit"
                isLoading={
                  statusRecover === "loading" || statusReset === "loading"
                }
              >
                {isTokenSent ? "ALTERAR SENHA" : "ENVIAR CÓDIGO"}
              </StdButton>
            </Flex>
            <Flex justify="center" pt="10" pb="14">
              <WhiteBgButton onClick={() => router.push("/")}>
                VOLTAR
              </WhiteBgButton>
            </Flex>
          </Stack>
        </Flex>
      </AnimatedStack>
    </>
  );
};

export default ForgotPassword;
