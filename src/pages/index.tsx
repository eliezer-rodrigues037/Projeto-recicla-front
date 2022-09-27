import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
  Text,
  Box,
} from "@chakra-ui/react";
import { loginSchema } from "../validations/loginSchema";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StdButton } from "../components/StdButton";
import { AnimatedStack } from "../components/AnimatedStack";

type LoginData = {
  email: string;
  password: string;
};

const Main: NextPage = () => {
  const { Login, isLoading } = useAuth();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const defaultValues: LoginData = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: yupResolver(loginSchema),
    defaultValues,
    delayError: 1000,
  });

  const values = watch();

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatedStack spacing="14" minH="100vh" role="index/stack">
        <Flex
          flex={1}
          alignSelf="center"
          justifyContent="end"
          ml="auto"
          display={["none", "none", "flex"]}
        >
          <Image
            alt="Login Image"
            boxSize="xl"
            src="/static/images/tablet-login.png"
          />
        </Flex>
        <Flex
          p={8}
          flex={1}
          align={"center"}
          justify={"start"}
          overflow="hidden"
        >
          <Stack
            as="form"
            onSubmit={handleSubmit(() => Login(values.email, values.password))}
            spacing={4}
            w={"full"}
            maxW={"md"}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            px="6"
            pt="9"
            pb="24"
          >
            <Text fontSize="1.25rem" fontWeight="700" color="gray.400">
              BEM-VINDO!
            </Text>
            <Heading role="index/heading" fontSize="2.5rem">
              FAÇA SEU LOGIN
            </Heading>
            <FormControl isRequired>
              <FormLabel color="gray.400">Email</FormLabel>
              <Input
                {...register("email")}
                focusBorderColor={"green.500"}
                placeholder="e-mail"
                type="email"
              />
              {errors && errors.email && (
                <FormHelperText>
                  {errors.email.message && errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400">Senha</FormLabel>
              <InputGroup>
                <Input
                  {...register("password")}
                  focusBorderColor={"green.500"}
                  placeholder="senha"
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
              {errors && errors.password && (
                <FormHelperText>
                  {errors.password.message && errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"flex-end"}
              >
                <Link
                  fontSize="0.8rem"
                  onClick={() => router.push("/forgot-password")}
                >
                  Esqueceu sua senha?
                </Link>
              </Stack>
              <StdButton
                isLoading={isLoading}
                disabled={isLoading}
                type="submit"
                h="14"
              >
                Entrar
              </StdButton>
            </Stack>
            <Box pt="12">
              <Text
                fontSize="0.8rem"
                fontWeight="400"
                textAlign="center"
                color="gray.400"
              >
                AINDA NÃO POSSUI UMA CONTA?
                <Link
                  fontWeight="bold"
                  color="black"
                  onClick={() => router.push("/register")}
                >
                  {" "}
                  CADASTRE-SE
                </Link>
              </Text>
            </Box>
          </Stack>
        </Flex>
      </AnimatedStack>
    </>
  );
};

export default Main;
