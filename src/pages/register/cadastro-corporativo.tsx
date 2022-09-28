import { Flex, VStack, Image } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { AnimatedStack } from "../../components/AnimatedStack";

const CadastroCorporativo: NextPage = () => {
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
            src="/static/images/tablet-login-corporativo.png"
            alt="Image of two peple pointing to form."
            boxSize="lg"
          />
        </Flex>
        <VStack
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          width="full"
          maxW="md"
          px="6"
          as="form"
        ></VStack>
      </AnimatedStack>
    </>
  );
};

export default CadastroCorporativo;
