import {
    Button,
    Flex,
    Link,
    useColorMode,
    useColorModeValue,
    Tooltip,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalFooter,
    ModalContent,
    Button as ModalButton,
    Divider,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";
import { RxAvatar, RxExit } from "react-icons/rx";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineSettings, MdCastForEducation } from "react-icons/md";
import { FaSun, FaMoon, FaGlobeAsia } from "react-icons/fa";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Sidebar = () => {
	const { colorMode, toggleColorMode } = useColorMode();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
	const user = useRecoilValue(userAtom);
	const logout = useLogout();

	return (
        <Flex
            direction={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            h={"100vh"}
            w={"60px"}
            p={"2"}
            px={10}
            bg={colorMode === "light" ? "orange.100" : "whiteAlpha.100"}
        >
            <Flex direction={"column"} alignItems={"center"} alignContent={"flex-start"}>
                <Tooltip label="User" aria-label="User" hasArrow placement="right" p={"2"} fontSize={"md"}>
                <Button cursor={"pointer"} as={RouterLink} to={`/${user?.username}`} rounded={"full"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                    <Link>
                        <RxAvatar size={36} mx={5} rounded={"3xl"}/>
                    </Link>
                </Button>
                </Tooltip>

                <Tooltip label="Chats" aria-label="Chats" hasArrow placement="right" p={"2"} fontSize={"md"}>
                <Button cursor={"pointer"} as={RouterLink} to={`/`} rounded={"3xl"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                    <Link>
                        <BsFillChatDotsFill size={36} mx={5}/>
                    </Link>
                </Button>
                </Tooltip>

                <Tooltip label="Groups" aria-label="Groups" hasArrow placement="right" p={"2"} fontSize={"md"}>
                <Button cursor={"pointer"} as={RouterLink} to={`/group`} rounded={"3xl"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                    <Link>
                        <HiUserGroup size={36} mx={5}/>
                    </Link>
                </Button>
                </Tooltip>

                {user.isLecturer ? (
                    <Tooltip label="Courses" aria-label="Courses" hasArrow placement="right" p={"2"} fontSize={"md"}>
                    <Button cursor={"pointer"} as={RouterLink} to={`/courses`} rounded={"3xl"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                        <Link>
                            <MdCastForEducation size={36} mx={5}/>
                        </Link>
                    </Button>
                    </Tooltip>
                ): ("")}

{/*
                <Tooltip label="Community" aria-label="Community" hasArrow placement="right" p={"2"} fontSize={"md"}>
                <Button cursor={"pointer"} as={RouterLink} to='/community' mt={3} rounded={"3xl"} bg={useColorModeValue("orange.300", "orange.700")}>
                    <Link>
                        <FaGlobeAsia size={36} mx={5}/>
                    </Link>
                </Button>
                </Tooltip>
*/}
                {user.isAdmin ? (
                    <Tooltip label="Admin" aria-label="Admin" hasArrow placement="right" p={"2"} fontSize={"md"}>
                        <Button cursor={"pointer"} as={RouterLink} to='/adminControl' mt={3} rounded={"3xl"} bg={useColorModeValue("orange.300", "orange.700")}>
                            <Link>
                                <GrUserAdmin size={36} mx={5} />
                            </Link>
                        </Button>
                    </Tooltip>
                ) : ("")
                }

                <Tooltip label="UI Mode" aria-label="UI Mode" hasArrow placement="right" p={"2"} fontSize={"md"}>
                <Button cursor={"pointer"} rounded={"3xl"} onClick={toggleColorMode} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                    {colorMode === "light" ? <FaMoon mx={5} size={36} /> : <FaSun mx={5} size={36}  />}
                </Button>
                </Tooltip>

                <Flex direction={"column"} mt={"8dvh"}>
                    <Tooltip label="Settings" aria-label="Settings" hasArrow placement="right" p={"2"} fontSize={"md"}>
                    <Button cursor={"pointer"} as={RouterLink} to={`/settings`} rounded={"3xl"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                        <Link>
                            <MdOutlineSettings size={36} mx={5} />
                        </Link>
                    </Button>
                    </Tooltip>

                    <Tooltip label="Customer Support" aria-label="Customer-Support" hasArrow placement="right" p={"2"} fontSize={"md"}>
                    <Button cursor={"pointer"} as={RouterLink} to={"/customerService"} rounded={"3xl"} mt={3} bg={useColorModeValue("orange.300", "orange.700")}>
                        <Link>
                            <RiCustomerService2Fill size={36} mx={5}/>
                        </Link>
                    </Button>
                    </Tooltip>

                    <Tooltip label="Log Out" aria-label="Log Out" hasArrow placement="right" p={"2"} fontSize={"md"}>
                    <Button cursor={"pointer"} size={"xl"} onClick={() => setIsModalOpen(true)} px={4} rounded={"3xl"} my={3} bg={useColorModeValue("orange.300", "orange.700")}>
                        <RxExit size={36} mx={5}/>
                    </Button>
                    </Tooltip>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalBody textAlign={"center"}>Are you sure you want to logout?</ModalBody>
                        <ModalFooter display={"flex"} justifyContent={"center"}>
                            <ModalButton px={"12"} colorScheme="orange" mr={3} onClick={logout} isLoading={isLoading}>
                                Yes
                            </ModalButton>
                            <ModalButton px={"12"} onClick={() => setIsModalOpen(false)} isDisabled={isLoading}>
                                No
                            </ModalButton>
                        </ModalFooter>
                    </ModalContent>
                    </Modal>
                </Flex>
            </Flex>
        </Flex>
	);
};

export default Sidebar;
