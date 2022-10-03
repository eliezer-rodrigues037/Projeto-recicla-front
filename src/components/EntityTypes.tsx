import { Box, useRadio, RadioProps, Flex, Input } from "@chakra-ui/react";

export function EntityTypes(props: RadioProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" w="100%">
      <Input {...input} />
      <Flex
        h="16"
        {...checkbox}
        justify="center"
        alignItems="center"
        cursor="pointer"
        borderWidth="1px"
        _checked={{
          bg: "green.500",
          color: "white",
          filter: "brightness(0.95)",
          transition: "all 0.3s",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Flex>
    </Box>
  );
}
