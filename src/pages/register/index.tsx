import { NextPage } from "next";
import {
  Box,
  Flex,
  Stack,
  Text,
  Image,
  Heading,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import { StdButton } from "../../components/StdButton";
import { WhiteBgButton } from "../../components/WhiteBgButton";

const Register: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Cadastro</title>
      </Head>
      <HStack
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.75 } }}
        exit={{ opacity: 0 }}
        direction={{ base: "column", md: "row" }}
        role="Register/stack"
        minH="100vh"
        justify="center"
      >
        <Flex align="center" display={["none", "none", "flex"]}>
          <Image
            src="/static/images/Choice-Register.png"
            alt="Escolha perfil Individual/Corporativo"
            boxSize="lg"
          />
        </Flex>
        <VStack
          border="1px solid"
          borderColor="gray.200"
          px="6"
          pt="14"
          borderRadius="lg"
          w="lg"
          h="xl"
        >
          <Text
            alignSelf="start"
            color="gray.400"
            fontWeight="bold"
            fontSize="xl"
            lineHeight="7"
          >
            Primeiro.
          </Text>
          <Heading
            alignSelf="start"
            fontWeight="semibold"
            fontSize="4xl"
            lineHeight="10"
            pb="16"
          >
            INDENTIFIQUE-SE
          </Heading>
          <VStack spacing="14" w="xs">
            <StdButton
              w="100%"
              h="20"
              fontWeight="medium"
              fontSize="2xl"
              lineHeight="9"
            >
              PERFIL INDIVUDUAL
            </StdButton>
            <StdButton
              w="100%"
              h="20"
              fontWeight="medium"
              fontSize="2xl"
              lineHeight="9"
            >
              PERFIL CORPORATIVO
            </StdButton>
          </VStack>
          <Box pt="8">
            <WhiteBgButton
              onClick={() => router.push("/")}
              w="8rem"
              h="14"
              fontWeight="bold"
              fontSize="xl"
              lineHeight="7"
            >
              VOLTAR
            </WhiteBgButton>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default Register;
