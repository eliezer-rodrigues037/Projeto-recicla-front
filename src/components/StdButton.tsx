import { Button, ButtonProps } from "@chakra-ui/react";

export const StdButton = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <Button
      variant="solid"
      _hover={{ filter: "brightness(0.9)" }}
      colorScheme="green"
      borderRadius="lg"
      {...rest}
    >
      {children}
    </Button>
  );
};
