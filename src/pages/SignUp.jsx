import React, { useState } from "react";
import styled from "styled-components";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import AuthActions from "../redux/middleware/auth";

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
`;

const Title = styled.h1`
  margin-bottom: 20px;
  letter-spacing: 5px;
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

const Name = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
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

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.soft};
  width: 45%;
`;

const More = styled.div``;

const SignUp = ({ theme }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      const apiResponse = await AuthActions.UserSignup({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      console.log(apiResponse);

      if (!apiResponse.status) {
        return toast.error(apiResponse.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
      } else {
        toast.success(apiResponse.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/verifyOtp");
        }, 2500);
      }
    } catch (error) {
      // console.log(error.response.data.message);
      if (error.response.message) {
        toast.error(error.response.message, {
          position: "top-right",
          theme: theme ? "light" : "dark",
          autoClose: 2000,
        });
      }
    }
    // }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Join Now</Title>
        <Name>
          <InputBox>
            <PersonOutlineOutlinedIcon />
            <Input
              type="text"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </InputBox>
          <InputBox>
            <PersonOutlineOutlinedIcon />
            <Input
              type="text"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </InputBox>
        </Name>
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
        <Stack spacing={2} direction="row" marginTop="25px" width="100%">
          <Button
            variant="contained"
            onClick={signUpHandler}
            style={{
              backgroundColor: "#ff0000",
              width: "inherit",
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            Signup
          </Button>
          {/* <Link to="/signin" style={{ textDecoration: "none", width: "109%" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#ff0000",
                width: "100%",
                textAlign: "center",
                borderRadius: "5px",
              }}
            >
              Login
            </Button>
          </Link> */}
        </Stack>
        <p
          style={{
            textAlign: "start",
            width: "100%",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Already have an account?
          <Link
            to="/signin"
            style={{
              textDecoration: "none",
              color: "inherit",
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            <Text>Login</Text>
          </Link>
        </p>
      </Wrapper>
    </Container>
  );
};

export default SignUp;
