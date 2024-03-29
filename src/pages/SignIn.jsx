import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import { Box, IconButton, Typography, Button, Stack } from "@mui/material";
import AuthActions from "../redux/middleware/auth";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import { baseURL } from "../config/constant";
import {
  loginFailed,
  loginPending,
  loginSuccess,
} from "../redux/Slices/authSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 2px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  border-radius: 15px;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  width: 100%;
  margin: 0px 40px;
`;

const Title = styled.h1`
  margin-bottom: 10px;
  letter-spacing: 4px;
`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  padding: 15px;
  width: inherit;
  font-size: 14px;
`;

const Text = styled.p`
  // margin-top: 10px;
  align-self: flex-end;
  color: ${({ theme }) => theme.textSoft};
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.text};
    text-decoration: underline;
  }
`;

const TextBox = styled.div`
  font-weight: bold;
`;

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.soft};
  width: 45%;
`;

const SignIn = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const passwordVisibilityHandler = () => {
    setShowPassword((show) => !show);
  };
  const confirmPasswordVisibilityHandler = () => {
    setShowConfirmPassword((show) => !show);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginPending());
      const apiResponse = await AuthActions.UserLogin({
        email,
        password,
        confirmPassword,
      });
      console.log(apiResponse);

      if (!apiResponse.status) {
        if (apiResponse.message === "Check your email and verify your OTP first") {
          toast.error(apiResponse.message, {
            position: "top-right",
            theme: theme ? "light" : "dark",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/verifyOtp");
          }, 2500);
        } else {
          toast.error(apiResponse.message, {
            position: "top-right",
            theme: theme ? "light" : "dark",
            autoClose: 2000,
          });
        }
        return dispatch(loginFailed(apiResponse));
      } else {
        toast.success(apiResponse.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
        const { data, token } = apiResponse;
        const payload = {
          user: data,
          token,
        };
        console.log(payload);
        localStorage.setItem("dummyUserToken", token);
        dispatch(loginSuccess(payload));
        // localStorage.setItem("loginUserDetails", JSON.stringify(payload))
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
    } catch (err) {
      console.log(err.response.message);
      if (
        err.response.message === "Check your email and verify your OTP first"
      ) {
        toast.error(err.response.data.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/signupVerifyOtp");
        }, 2500);
      } else {
        toast.error(err.response.data.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
      }
      dispatch(loginFailed(err));
    }
  };

  const googleSignInHandler = async () => {
    try {
      dispatch(loginPending());
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const apiResponse = await axios.post(`${baseURL}/v1/auth/googleSignIn`, {
        firstName: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      });

      console.log(apiResponse.data);
      const { data, token } = apiResponse.data;
      const payload = {
        user: data,
        token,
      };
      console.log(payload);
      localStorage.setItem("dummyUserToken", token);
      dispatch(loginSuccess(payload));
      // localStorage.setItem("loginUserDetails", JSON.stringify(payload))
      toast.success(apiResponse.message, {
        position: "top-right",
        theme: theme ? "light" : "dark",
        autoClose: 2000,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(loginFailed(error));
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Welcome Back</Title>
        <InputBox>
          <EmailIcon />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputBox>
        <InputBox>
          <PasswordOutlinedIcon />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <IconButton
            sx={{ color: "red" }}
            aria-label="toggle password visibility"
            onClick={passwordVisibilityHandler}
            edge="end"
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </IconButton>
        </InputBox>
        <InputBox>
          <PasswordOutlinedIcon />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <IconButton
            sx={{ color: "red" }}
            aria-label="toggle password visibility"
            onClick={confirmPasswordVisibilityHandler}
            edge="end"
          >
            {showConfirmPassword ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </IconButton>
        </InputBox>
        <Link
          to="/forgotpassword"
          style={{
            textDecoration: "none",
            textAlign: "end",
            marginTop: 10,
            alignSelf: "flex-end",
          }}
        >
          <Text>Forgot Password?</Text>
        </Link>
        <Stack spacing={2} direction="row" marginTop="15px" width="100%">
          <Button
            variant="contained"
            onClick={loginHandler}
            style={{
              backgroundColor: "#ff0000",
              textAlign: "center",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            Login
          </Button>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "6px",
            width: "100%",
          }}
        >
          <Hr />
          <Typography
            variant="p"
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              color: `${({ theme }) => theme.text}`,
              // marginBottom: "2px",
            }}
          >
            or
          </Typography>
          <Hr />
        </Box>
        <Button
          variant="outlined"
          style={{
            color: "",
            backgroundColor: "transparent",
            marginTop: "6px",
            border: "1px solid",
          }}
          onClick={googleSignInHandler}
        >
          Sign In With Google
        </Button>
        <TextBox
          style={{
            textAlign: "start",
            width: "100%",
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Don't have an account?
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              color: "inherit",
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            <Text>SignUp</Text>
          </Link>
        </TextBox>
      </Wrapper>
    </Container>
  );
};

export default SignIn;
