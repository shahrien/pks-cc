import {
    Flex, Text,
    Box, Accordion,
    AccordionItem, AccordionButton,
    AccordionPanel, AccordionIcon,
    useColorModeValue, Checkbox,
    Heading, Skeleton,
    SkeletonCircle
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const EnrolledCourses = () => {
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignment, setLoadingAssignment] = useState(true);
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);
    const { socket } = useSocket();

    useEffect(() => {
        const getData = async () => {
            try {
                const coursesResponse = await fetch(`/api/students/getEnrolledCourses`);
                const assignmentsResponse = await fetch(`/api/students/getAssignments/${user._id}`);

                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    setCourses(coursesData.courses);
                } else {
                    showToast("Error", "Failed to fetch courses", "error");
                }

                if (assignmentsResponse.ok) {
                    const assignmentsData = await assignmentsResponse.json();
                    setAssignments(assignmentsData.assignments);
                } else {
                    showToast("Error", "Failed to fetch assignments", "error");
                }
            } catch (error) {
                console.error(error);
            }finally {
                setLoadingAssignment(false);
            }
        };

        getData();
    }, [showToast]);


    useEffect(() => {
        // Listen for the "addAssignment" event
        socket.on("addAssignment", (newAssignment) => {
            setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
        });

        // Listen for the "deleteAssignment" event
        socket.on("deleteAssignment", (deletedAssignment) => {
            setAssignments((prevAssignments) => prevAssignments.filter((assignment) => assignment._id !== deletedAssignment._id));
        });

        return () => {
            socket.off("addAssignment");
            socket.off("deleteAssignment");
        };
    }, [socket]);


    const handleCheckboxChange = async (assignmentId) => {
        try {
            const response = await fetch(`/api/students/markAssignmentDone/${assignmentId}`, {
                method: "PUT",
            });

            if (response.ok) {
              setAssignments((prevAssignments) =>
                  prevAssignments.map((assignment) =>
                      assignment._id === assignmentId ? { ...assignment, isDone: !assignment.isDone } : assignment
                  )
              );
            } else {
                showToast("Error", "Failed to mark assignment as done", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error", "An unexpected error occurred", "error");
        }
    };


    return (
        <Flex p={4}>
            <Flex
                flexDirection="column"
                w="22.5rem"
                mr={4}
                p={2}
                rounded="xl"
                position={"relative"}
            >
                <Accordion allowToggle bg={useColorModeValue("whiteAlpha.700", "blackAlpha.700")} w={"100%"}>
                    <AccordionItem>
                        <AccordionButton>
                            <Box>
                                Enrolled Courses
                                <AccordionIcon ml={2} />
                            </Box>
                        </AccordionButton>
                        {courses.map((course) => (
                            <AccordionPanel pb={4} key={course._id}>
                                <Box>
                                    {course.courseCode} - {course.courseName}
                                </Box>
                            </AccordionPanel>
                        ))}
                    </AccordionItem>
                </Accordion>
            </Flex>

            {loadingAssignment && (
              <Flex justifyContent="center" alignItems="center" gap={8}>
                  {[0, 1].map((_, i) => (
                      <Box
                          key={i}
                          bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.300")}
                          borderRadius="lg"
                          boxShadow="md"
                          p={4}
                          px={4}
                          w={"25dvw"}
                      >
                          <SkeletonCircle size={"16"} />
                          <Flex w={"full"} flexDirection={"column"} gap={2}>
                              <Skeleton h={"16px"} w={"120px"} />
                              <Skeleton h={"16px"} w={"100%"} />
                              <Skeleton h={"12px"} w={"120px"} />
                              <Skeleton h={"12px"} w={"90%"} />
                          </Flex>
                      </Box>
                  ))}
              </Flex>
            )}
            <Flex flexDirection="column" w="100%">
                <Flex
                    flexWrap="wrap"
                    justifyContent="space-between"
                >
                    {assignments.map((assignment) => (
                        <Box
                            key={assignment._id}
                            bg={useColorModeValue(
                                assignment.isDone ? "green.500" : "yellow.500",
                                assignment.isDone ? "green.700" : "gray.700"
                            )}
                            p={6}
                            rounded="xl"
                            mb={4}
                            w={{ base: "100%", md: "48%" }}
                        >
                            <Flex flexDirection="column" mr={8}>
                                <Heading display={"flex"} flexDirection={"row"}>
                                <Text fontWeight="medium" fontSize="xl" mb={3}>
                                    <span style={{ marginRight: "4px" }}>Assignment: </span>
                                    {assignment.name}
                                </Text>
                                <Checkbox
                                    p={4}
                                    px={4}
                                    mx={6}
                                    isChecked={assignment.isDone}
                                    onChange={() => handleCheckboxChange(assignment._id)}
                                />
                                </Heading>
                                <Text fontWeight="medium" fontSize="lg" mb={3}>
                                    <span style={{ marginRight: "4px" }}>Description: </span> {assignment.description}
                                </Text>
                                <Text fontWeight="medium" fontSize="lg">
                                    <span style={{ marginRight: "4px" }}>Due Date: </span> {assignment.dueDate}
                                </Text>
                            </Flex>
                        </Box>
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default EnrolledCourses;
