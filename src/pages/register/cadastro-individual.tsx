import { Flex, Image, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { AnimatedStack } from "../../components/AnimatedStack";

type RegisterIndividualData = {
  name: string;
  cpf: string;
  email: string;
  cel: string;
  birthDate: Date;
  password: string;
  comfirmPassword: string;
  entity: "fisica" | "juridica";
  bancAccount: {
    accountOwner: string;
    cpf: string;
    banc: number;
    agency: number;
    agencyDg: number;
    accountNumber: number;
    accountDg: number;
  };
};

const CadastroIndividual: NextPage = () => {
  const [step, setStep] = useState(1);

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
            src="/static/images/mobile-login.png"
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

export default CadastroIndividual;
