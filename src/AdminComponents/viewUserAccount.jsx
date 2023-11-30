import React, { useState, useEffect } from "react";
import {
    Flex,
    Grid,
    Box,
    useColorModeValue,
    CloseButton,
    Spinner
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";


const ViewUserAccount = () => {
    const [userData, setUserData] = useState([]);
    const showToast = useShowToast();
    const [loadingUserData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/admin/getAllUsers");
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserData();
    }, []);

    const deleteUserAccount = async (userId) => {
        try {
            const response = await fetch(`/api/admin/deleteUser/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the deleted user from the state
                setUserData((prevUsers) =>
                  prevUsers.filter((user) => user._id !== userId)
                );
                showToast("Success", "User account has been deleted", "success");
            } else {
                throw new Error("Failed to delete user account.");
            }
        } catch (error) {
            console.error("Error deleting user account:", error);
            showToast("Error", error, "error");
        }
    };


    return (
        <Flex justifyContent="center" alignItems="center" w="90%" h="100%" ml={12} overflowY={"auto"}>
            {loadingUserData ? (
                <Flex>
                    <Spinner/>
                </Flex>
            ) : (
                <Grid
                    templateColumns="1fr 1fr 1fr 1fr 1fr 0.25fr"
                    gap={2}
                    p={4}
                    maxH={"70vh"}
                    overflowY={"auto"}
                    bg={useColorModeValue("wheat", "gray.600")}
                >
                <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">User ID</Box>
                <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Username</Box>
                <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">NRIC</Box>
                <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Email</Box>
                <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Access Level</Box>
                <Box textAlign="center"></Box>
                {userData.map(user => (
                    <React.Fragment key={user._id}>
                        <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{user._id}</Box>
                        <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{user.username}</Box>
                        <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{user.nric}</Box>
                        <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{user.email}</Box>
                        <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{user.isLecturer ? "Lecturer" : user.isStudent ? "Student" : "Regular User"}</Box>
                        <Box textAlign="center" onClick={() => deleteUserAccount(user._id)}><CloseButton textColor={useColorModeValue("black", "white")} /></Box>
                    </React.Fragment>
                ))}
            </Grid>
            )}
        </Flex>
    );
};

export default ViewUserAccount;
