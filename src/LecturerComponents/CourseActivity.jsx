import {
    Flex, useColorModeValue,
    Text, Input,
    Button, Grid,
    Box, CloseButton,
    Image, Select,
    useDisclosure, Heading,
    Table, Thead,
    Th, Td,
    Tr,Tbody
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext.jsx";
import { useRecoilValue } from "recoil";
import { FaPlus } from "react-icons/fa";
import userAtom from "../atoms/userAtom.js";
import AddAssignments from "./AddAssignments.jsx";


const CourseActivity = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [enrollmentKey, setEnrollmentKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const showToast = useShowToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { socket } = useSocket();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        socket?.on("addCourse", (newCourse) => {
            setCourses((prevCourses) => [...prevCourses, newCourse]);
        });

        return () => {
            socket?.off("addCourse");
        };
    }, [socket]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`/api/lecturer/getCourses/${user._id}`, {
                    method: "GET"
                });
                const data = await response.json();

                setCourses(data);
            }catch(error) {
                console.log(error);
            }
        }
        fetchCourses();
    }, []);


    useEffect(() => {
        const getAllCourses = async () => {
            const response = await fetch("/api/lecturer/getAllCourses", {
                method: "GET"
            });

            if(response.ok) {
                const data = await response.json();
                setAllCourses(data);
            } else {
                showToast("Error", "Failed to fetch courses", "error");
            }
        };

        getAllCourses();
    },[]);


    useEffect(() => {
        // Listen for the "addAssignment" event
        socket?.on("addAssignment", (newAssignment) => {
            setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
        });

        return () => {
            socket?.off("addAssignment");
        };
    }, [socket]);

    useEffect(() => {
        fetchAssignment();
    },[]);

    const fetchAssignment = async () => {
        const response = await fetch(`/api/lecturer/getAssignments/${user._id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if(response.ok) {
            setAssignments(data);
        } else {
            showToast("Error", "Failed to fetch assignments", "error");
        }
    };

    const addCourse = async () => {
        if(!selectedCourse || !enrollmentKey) {
            showToast("Error", "Incomplete field", "error");
            return;
        }
        try {
            setLoading(true)
            const response = await fetch("/api/lecturer/addCourse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course: selectedCourse,
                    enrollmentKey: enrollmentKey
                })
            });

            const data = await response.json();
            if(response.ok) {
                showToast("Success", `Course Added Successfully!`, "success");
            } else {
                showToast("Error", data.error, "error");
            }
        }catch(error) {
            showToast("Error", error, "error");
        }finally {
            setLoading(false);
            setSelectedCourse("");
            setEnrollmentKey("");
        }
    };


    const deleteCourse = async (courseId) => {
        try {
            const response = await fetch(`/api/lecturer/deleteCourse/${courseId}`, {
                method: "DELETE",
            });

            if(response.ok) {
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
                showToast("Success", "Assignment has been deleted", "success");
            }
        }catch(error) {
            showToast(error);
        }
    }


    const handleDeleteAssignment = async (assignmentId) => {
        const response = await fetch(`/api/lecturer/deleteAssignment/${assignmentId}`,{
            method: "DELETE"
        });

        if(response.ok) {
            setAssignments((prevAssignment) => prevAssignment.filter((assignment) => assignment._id !== assignmentId));
            showToast("Success", "Assignment has been deleted", "success");
        }
    }

    const handleAddAssignmentClick = () => {
        onOpen();
    };


    return (
        <Flex
            p={4}
            gap={4}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            overscrollY={"auto"}
            w="70vw"
        >
            <Flex
                bg={useColorModeValue("orange.300", "orange.600")}
                p={4}
                rounded={"md"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
            >
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Add Course</Text>
                <Flex flexDirection={"column"}>
                    <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} my={2} bg={useColorModeValue("white", "gray.200")}>
                        <option value={""} disabled>Select Course</option>
                        {allCourses.map((course) => (
                            <option key={course._id} value={JSON.stringify(course)}>{course.courseCode + course.courseName}</option>
                        ))}
                    </Select>

                    <Flex flexDirection={"column"}>
                        <Text fontWeight={"bold"} w={"70%"} mt={3}>Enrollment Key: </Text>
                        <Input bg={useColorModeValue("white", "gray.200")} value={enrollmentKey} onChange={(e) => setEnrollmentKey(e.target.value)} my={2}/>
                        <Button w={"100%"} onClick={addCourse} isLoading={loading}>Add Course</Button>
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                bg={useColorModeValue("orange.300", "orange.600")}
                p={4}
                rounded={"md"}
                flexDirection={"column"}
                mb={4}
            >
                <Text textAlign={"center"} fontSize={"xl"} fontWeight={"semibold"} mb={2}>Courses</Text>
                <Flex flexDirection={"column"} w={"100%"}>
                    <Grid
                        templateColumns={"1fr 1fr 1fr 0.2fr"}
                        gap={2}
                        p={4}
                        bg={useColorModeValue("wheat", "whiteAlpha.400")}
                    >
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Code</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Name</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Enrollment Key</Box>
                        <Box p={1} textAlign={"center"}></Box>
                        {courses.map((course) => (
                            <React.Fragment key={course._id}>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseCode}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseName}</Box>
                                <Box p={2} textAlign={"center"} textColor={"black"}>{course.courseKey}</Box>
                                <Box textAlign={"center"} mt={2}>
                                    <CloseButton p={5} bg={useColorModeValue("red.400", "red.600")} onClick={() => deleteCourse(course._id)} />
                                </Box>
                                <AddAssignments
                                    courseId={course._id}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                />
                            </React.Fragment>
                        ))}
                    </Grid>
                </Flex>
            </Flex>
            <Flex flexDirection="column" bg={useColorModeValue("orange.300", "orange.600")} w="100%" p={4} rounded="xl">
                <Flex p={2} rounded="lg">
                    <Text fontSize={"2xl"} fontWeight="bold">Assignments</Text>
                    <Button mx={8} onClick={handleAddAssignmentClick}>
                        <FaPlus size={12}/>
                    </Button>
                </Flex>

                <Table variant="simple" bg={useColorModeValue("whiteAlpha.800", "blackAlpha.600")} rounded="lg" mt={4} w={"inherit"}>
                    <Thead>
                        <Tr>
                            <Th>Course Code</Th>
                            <Th>Course Name</Th>
                            <Th>Assignment</Th>
                            <Th>Description</Th>
                            <Th>Due Date</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody w={"100vw"}>
                    {courses.map((course) => (
                        assignments
                        .filter((assignment) => assignment.course.toString() === course._id)
                        .map((assignment) => (
                        <Tr key={assignment._id}>
                            <Td>
                                <Text fontWeight="medium" fontSize="xl">
                                    {course.courseCode}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontWeight="medium" fontSize="xl">
                                    {course.courseName}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontWeight="medium" fontSize="xl">
                                    {assignment.name}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontWeight="medium" fontSize="lg">
                                    {assignment.description}
                                </Text>
                            </Td>
                            <Td>
                                <Text fontWeight="medium" fontSize="lg">
                                    {assignment.dueDate}
                                </Text>
                            </Td>
                            <Td>
                                <CloseButton mt={2} p={2} bg={"red.400"} onClick={() => handleDeleteAssignment(assignment._id)} />
                            </Td>
                        </Tr>
                        ))
                    ))}
                    </Tbody>
                </Table>
            </Flex>
        </Flex>
    );
}

export default CourseActivity;