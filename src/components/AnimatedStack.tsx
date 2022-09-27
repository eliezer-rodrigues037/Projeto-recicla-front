import { Stack, StackProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const AnimatedStack = (props: StackProps) => {
  const { children, ...rest } = props;
  return (
    <Stack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.75 } }}
      exit={{ opacity: 0 }}
      direction={{ base: "column", md: "row" }}
      {...rest}
    >
      {children}
    </Stack>
  );
};
