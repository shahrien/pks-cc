import { useRecoilValue } from "recoil";
import LoginCard from "../StartUp/LoginCard";
import SignupCard from "../StartUp/SignupCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);

	return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
