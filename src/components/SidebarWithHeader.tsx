import React, {
  Dispatch,
  ElementType,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useMediaQuery,
  useColorMode,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  AccordionButtonProps,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import { IconType } from "react-icons";

import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

import { DestiniesIcon, MaterialsIcon, UserIcon } from "../assets/icons";

type LinkItemProps = {
  name: string;
  pageLink?: string;
  icon?: IconType | ElementType | undefined;
  role: "user" | "corp" | "adm";
  panel?: {
    name: string;
    pageLink: string;
  }[];
};

const LinkItems: Array<LinkItemProps> = [
  {
    name: "Usuários",
    icon: UserIcon,
    role: "adm",
    panel: [
      {
        name: "Individual",
        pageLink: "/users/individual",
      },
      {
        name: "Corporativo",
        pageLink: "/users/individual",
      },
    ],
  },
  {
    name: "Materiais",
    pageLink: "/materials",
    icon: MaterialsIcon,
    role: "adm",
  },
  {
    name: "Destinos",
    pageLink: "/destinies",
    icon: IoLocationSharp,
    role: "adm",
  },
];

export const SidebarWithHeader = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  function getCurrentIndex(): number {
    let i: number = 0;
    LinkItems.map((item, index) => {
      if (router.pathname === item.pageLink) i = index;
    });
    return i;
  }

  return (
    <>
      <Box
        transition="3s ease"
        bg={useColorModeValue("#fff", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="4" justifyContent="center">
          <Image
            alt="Logo"
            src="/static/images/ReciclaLogo.png"
            width={colorMode === "light" ? 50 : 200}
            height={50}
          />
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <Accordion
          display="flex"
          h={"calc(100% - 80px)"}
          flexDirection={"column"}
          overflowY={"auto"}
          defaultIndex={[getCurrentIndex()]}
          onChange={getCurrentIndex}
          allowToggle
          allowMultiple
        >
          {LinkItems?.map((item, index) => (
            <NavItem
              key={item.name}
              icon={item.icon ?? undefined}
              pageLink={item.pageLink ?? undefined}
              panel={item.panel ?? undefined}
            >
              {item.name}
            </NavItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

interface NavItemProps extends AccordionButtonProps {
  icon: IconType | ElementType | undefined;
  pageLink: string | undefined;
  panel?: {
    name: string;
    pageLink: string;
  }[];
}

const NavItem = ({
  pageLink,
  icon,
  panel,
  children,

  ...rest
}: NavItemProps) => {
  const router = useRouter();

  const isCurrentLinkSelected = router.pathname === pageLink;

  return (
    <AccordionItem>
      <AccordionButton
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
        display="flex"
        align="center"
        p="4"
        role="group"
        bg={icon ? "green.500" : ""}
        color={icon ? "#fff" : "black"}
        borderLeft={isCurrentLinkSelected ? "5px solid" : ""}
        borderLeftColor={isCurrentLinkSelected ? "black.900" : ""}
        cursor="pointer"
        _hover={{
          bg: "green.500",
          color: "#fff",
        }}
        _expanded={{ borderLeft: "5px solid", borderLeftColor: "black.900" }}
        onClick={pageLink ? () => router.push(pageLink) : () => null}
        {...rest}
      >
        {icon && (
          <Icon
            fontSize="16"
            _groupHover={{
              color: "#fff",
            }}
            as={icon}
          />
        )}
        <Text ml="4">{children}</Text>
      </AccordionButton>
      {panel &&
        panel.map((item) => (
          <AccordionPanel
            cursor="pointer"
            _hover={{
              bg: "green.500",
              color: "#fff",
            }}
            key={item.name}
            onClick={() => router.push(item.pageLink)}
          >
            {item.name}
          </AccordionPanel>
        ))}
    </AccordionItem>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { user, Logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const [downMd] = useMediaQuery("(max-width: 48em)");

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#fff", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack spacing={{ base: "0", md: "6" }}>
        <Tooltip
          label={colorMode === "dark" ? "Ligar a luz" : "Desligar a luz"}
        >
          <IconButton
            sx={downMd ? { marginRight: "16px" } : {}}
            value={colorMode}
            icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
            aria-label="Color mode"
            onClick={toggleColorMode}
          />
        </Tooltip>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={user?.avatar} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.role}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("#fff", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => router.push("/profile")}>
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={Logout}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
