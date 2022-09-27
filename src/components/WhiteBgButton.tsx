import { Button, ButtonProps } from "@chakra-ui/react";

export const WhiteBgButton = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <Button
      bg="white"
      border="1.2px solid"
      borderColor="green.500"
      borderRadius="lg"
      color="green.500"
      {...rest}
    >
      {children}
    </Button>
  );
};
