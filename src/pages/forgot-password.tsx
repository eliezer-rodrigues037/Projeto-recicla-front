import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import {
  Button,
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
  HStack,
  Box,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import forgotSchema from "../validations/forgotSchema";
import resetPasswordSchema from "../validations/resetPasswordSchema";
import { useMutation } from "react-query";

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  newPassword: string;
};

const ForgotPassword: NextPage = () => {
  const toast = useToast();
  const router = useRouter();

  const [isTokenSent, setIsTokenSent] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValuesForgot: ForgotPasswordData = {
    email: "",
  };

  const defaultValuesReset: ResetPasswordData = {
    token: "",
    newPassword: "",
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
      <Stack
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.75 } }}
        exit={{ opacity: 0 }}
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        w="80%"
        m="auto"
        role="forgot-password/stack"
        justify="center"
      >
        <Flex align="center">
          <Image
            alt="Forgot newPassword Image"
            h="623px"
            w="auto"
            src="/static/images/forgotPassword.png"
          />
        </Flex>
        <Flex align={"center"} justify={"center"} w="580px" h="730px">
          <Stack
            border="1px solid #DDDDDD"
            borderRadius="lg"
            as="form"
            onSubmit={handleSubmitForgot(() => {
              isTokenSent ? mutateReset() : mutateRecover();
            })}
            w={"full"}
            maxW={"md"}
            px="32px"
          >
            <Heading fontSize="3xl" mt="24">
              RECUPERAÇÃO DE SENHA
            </Heading>
            {isTokenSent ? (
              <>
                <FormControl isRequired id="token" mt="12">
                  <FormLabel color="gray.400" fontSize="sm">
                    Token
                  </FormLabel>
                  <Input
                    {...registerReset("token")}
                    focusBorderColor={"blue.500"}
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
                  <FormLabel>Nova senha</FormLabel>
                  <InputGroup>
                    <Input
                      {...registerReset("newPassword")}
                      focusBorderColor={"blue.500"}
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

            <Button
              type="submit"
              isLoading={
                statusRecover === "loading" || statusReset === "loading"
              }
              colorScheme="green"
              _hover={{ filter: "brightness(0.9)" }}
            >
              {isTokenSent ? "Atualizar senha" : "Enviar código"}
            </Button>
            <Flex justify="center" pt="10" pb="20">
              <Button
                onClick={() => router.push("/")}
                bg="white"
                border="1.2px solid #0E918C"
                color="green.500"
              >
                Voltar
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default ForgotPassword;
