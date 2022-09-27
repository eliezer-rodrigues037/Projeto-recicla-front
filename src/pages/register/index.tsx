import { NextPage } from "next";
import { Box, Flex, Text, Image, Heading, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StdButton } from "../../components/StdButton";
import { WhiteBgButton } from "../../components/WhiteBgButton";
import { AnimatedStack } from "../../components/AnimatedStack";

const Register: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Cadastro</title>
      </Head>
      <AnimatedStack
        role="Register/stack"
        minH="100vh"
        align="center"
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
              onClick={() => router.push("/register/cadastro-individual")}
            >
              PERFIL INDIVUDUAL
            </StdButton>
            <StdButton
              w="100%"
              h="20"
              fontWeight="medium"
              fontSize="2xl"
              lineHeight="9"
              onClick={() => router.push("/register/cadastro-corporativo")}
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
      </AnimatedStack>
    </>
  );
};

export default Register;
