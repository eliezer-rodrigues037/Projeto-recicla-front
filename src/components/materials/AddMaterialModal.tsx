import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Material } from "../../types/Materials";
import { WhiteBgButton } from "../WhiteBgButton";
import { formatCurrency } from "../../utils/formatter";
import { useMutation } from "react-query";
import api from "../../services/api";

type AddMaterialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AddMaterialData = {
  name: string;
  price: string;
  status: boolean;
};

type MaterialApiResponse = {
  message: string;
  material: Material;
};

export const AddMaterialModal = ({
  isOpen,
  onClose,
}: AddMaterialModalProps) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const required = true; // Controls the 'isRequired' property of all FormControl components.

  /** ------------------- Form default data -------------------*/

  const defaultMaterialData: AddMaterialData = {
    name: "",
    price: "",
    status: true,
  };

  /** ------------------- useForm Hook -------------------*/

  const {
    register: registerMaterial,
    handleSubmit,
    watch: watchMaterial,
    formState: { errors: errorsMaterial },
  } = useForm<AddMaterialData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    //resolver: yupResolver(addMaterialSchema),
    defaultValues: defaultMaterialData,
  });

  const materialData = watchMaterial();

  const handleAddMaterial = async (): Promise<MaterialApiResponse> => {
    setIsLoading(true);
    materialData.price = materialData.price.replace(",", ".");
    console.log(materialData);
    const response: MaterialApiResponse = await api.post(
      "/materials",
      materialData
    );

    return response;
  };

  const { status, mutate } = useMutation(handleAddMaterial, {
    onSuccess: (response: MaterialApiResponse) => {
      setIsLoading(false);
      toast({
        title: "Sucesso.",
        description: response?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      onClose();
    },
    onError: (e: any) => {
      setIsLoading(false);
      toast({
        title: "Erro.",
        description: e.response.data.message + JSON.stringify(materialData),
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent w="lg" minW="lg" px="6" py="14" h="xl">
        <ModalHeader
          alignSelf="center"
          color="gray.400"
          fontSize="1.25rem"
          fontWeight="bold"
          mb="6"
        >
          Cadastrar material
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(() => mutate())}>
            <HStack spacing="5">
              <FormControl isRequired={required}>
                <FormLabel>Nome</FormLabel>
                <Input
                  {...registerMaterial("name")}
                  focusBorderColor={"green.500"}
                  type="text"
                />
              </FormControl>

              <FormControl isRequired={required}>
                <FormLabel>Preço/Kg</FormLabel>
                <InputGroup>
                  <InputLeftAddon>{"R$"}</InputLeftAddon>
                  <Input
                    {...registerMaterial("price")}
                    focusBorderColor={"green.500"}
                    type="text"
                    value={formatCurrency(materialData.price)}
                  />
                </InputGroup>
              </FormControl>
            </HStack>
            <FormControl pt="3">
              <FormLabel>Status</FormLabel>
              <Switch
                colorScheme="green"
                {...registerMaterial("status")}
                id="status"
                defaultChecked={materialData.status}
              />
            </FormControl>
            <VStack spacing="5" pt="10">
              <Button
                ref={initialRef}
                variant="solid"
                _hover={{ filter: "brightness(0.9)" }}
                colorScheme="green"
                borderRadius="lg"
                w="100%"
                type="submit"
                isLoading={isLoading}
              >
                Cadastrar
              </Button>
              <WhiteBgButton w="6rem" mr={3} onClick={onClose}>
                Voltar
              </WhiteBgButton>
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
