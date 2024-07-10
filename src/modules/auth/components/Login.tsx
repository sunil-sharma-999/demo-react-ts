import { emailRegex } from "@/constants/regex";
import { adminApi } from "@/services/api";
import { cookieKeys, setCookie } from "@/services/cookies";
import { useAppDispatch } from "@/store";
import { login } from "@/store/slices/authSlice";
import { IUser } from "@/types/users";
import { Button, CircularProgress, TextField } from "@mui/material";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import styles from "./Login.module.scss";
import { localStorageKeys, setLocalStorage } from "@/services/localStorage";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = yup.object().shape({
  email: yup.string().required("Email is required").matches(emailRegex, {
    message: "Email is invalid",
  }),
  password: yup
    .string()
    .required("Password required")
    .min(6, "Password length should be at least 6"),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");

  const {
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues,
    onSubmit: async ({ email, password }, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await adminApi.post("/login", {
          email,
          password,
        });
        const data = await res.data;
        if (data?.data) {
          setLocalStorage(localStorageKeys.USER, data?.data as IUser);
          setCookie(cookieKeys.TOKEN, data?.data?.authorization || "");
        }
        dispatch(login(data?.data || null));
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message || "");
        } else {
          return null;
        }
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema,
    validateOnMount: false,
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>Sign In</h1>
        <div className={styles.info}>Enter your username and password</div>
      </div>
      {error ? <div className={styles.alert}>{error}</div> : null}
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          className={styles.input_wrap}
          label="Email"
          variant="standard"
          color="secondary"
          required
          InputLabelProps={{
            style: {
              fontSize: "14px",
            },
          }}
          error={!!errors.email && !!touched.email}
          helperText={errors.email && touched.email ? errors.email : " "}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          name="email"
        />
        <TextField
          type="password"
          className={styles.input_wrap}
          label="Password"
          required
          variant="standard"
          color="secondary"
          InputLabelProps={{
            style: {
              fontSize: "14px",
            },
          }}
          error={!!errors.password && !!touched.password}
          helperText={
            errors.password && touched.password ? errors.password : " "
          }
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          name="password"
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          className={classNames(
            styles.button,
            isSubmitting ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          {isSubmitting ? (
            <CircularProgress size="16px" style={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;
