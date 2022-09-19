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
        minH="100vh"
        direction={{ base: "column", md: "row" }}
        role="forgot-password/stack"
      >
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack
            as="form"
            onSubmit={handleSubmitForgot(() => {
              isTokenSent ? mutateReset() : mutateRecover();
            })}
            spacing={8}
            w={"full"}
            maxW={"md"}
          >
            <HStack>
              <Button
                onClick={() => router.push("/")}
                leftIcon={<BiArrowBack />}
                colorScheme="blue"
                variant="outline"
              >
                Voltar
              </Button>
            </HStack>
            <Heading fontSize={"2xl"}>
              {isTokenSent ? "Digite sua nova senha" : "Recuperação de senha"}
            </Heading>
            {isTokenSent ? (
              <>
                <FormControl isRequired id="token">
                  <FormLabel>Token</FormLabel>
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
              <FormControl isRequired id="email">
                <FormLabel>E-mail</FormLabel>
                <Input
                  {...registerForgot("email")}
                  focusBorderColor={"blue.500"}
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
              colorScheme="blue"
            >
              {isTokenSent ? "Atualizar senha" : "Enviar código"}
            </Button>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt="Forgot newPassword Image"
            objectFit="cover"
            src="/static/images/mind-wp.jpeg"
          />
        </Flex>
      </Stack>
    </>
  );
};

export default ForgotPassword;
