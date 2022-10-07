import React, { useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import api from "../../services/api";
import { Material } from "../../types/Materials";
import { useMutation, useQueryClient } from "react-query";

type DeleteMaterialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chosenMaterial: Material;
};

export const DeleteMaterialModal = ({
  isOpen,
  onClose,
  chosenMaterial,
}: DeleteMaterialModalProps) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const toast = useToast();

  const queryClient = useQueryClient();

  const handleDeleteMaterial = async () => {
    const response = await api.delete(`/materials/${chosenMaterial?.id}`);

    return response;
  };

  const { status, mutate } = useMutation(handleDeleteMaterial, {
    onSuccess: ({ data }) => {
      toast({
        title: "Sucesso.",
        description: data?.message,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries("materials");
      onClose();
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
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remover material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Tem certeza que deseja remover o material {chosenMaterial?.name}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button
              ref={initialRef}
              isLoading={status === "loading"}
              colorScheme="blue"
              onClick={() => mutate()}
            >
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
