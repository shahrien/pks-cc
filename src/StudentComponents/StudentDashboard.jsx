import {
    Flex,
    useColorModeValue ,
    Text,
    Box,
    Button
} from "@chakra-ui/react";
import React, { useState } from "react";
import AllCourses from "./AllCourses";
import EnrolledCourses from "../StudentComponents/EnrolledCourses";

const StudentDashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState("allCourses");

    const renderComponent = () => {
        if(selectedComponent === "allCourses") {
            return <AllCourses/>
        }else if(selectedComponent === "enrolledCourses") {
            return <EnrolledCourses/>
        }
    }
    return (
        <Flex
            w={"100%"}
            bg={useColorModeValue("orange.100", "gray.dark")}
            h={"50px"}
            mt={"-4"}
            gap={2}
            flexDirection={"column"}
        >
            <Flex justifyContent={"center"} alignItems={"center"} mx={4} gap={4}>
                <Button textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("allCourses")}>All courses</Button>
                <Button textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("enrolledCourses")}>Enrolled courses</Button>
            </Flex>

            {renderComponent()}
        </Flex>
    );
}

export default StudentDashboard;