import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockPerson,
  Google,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./Login.scss";
import { EMAIL_REGEX } from "@/constants/common-constants";

// Login form validation schema

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .regex(EMAIL_REGEX, "Please enter a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must be at most 15 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute("data-theme", !isDarkMode ? "dark" : "light");
  };

  // Validates credentials and handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Simulate API call (replace with actual login logic)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" data-theme={isDarkMode ? "dark" : "light"}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LockPerson />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                type="text"
                variant="outlined"
                fullWidth
                className="login-input"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
                inputProps={{ "aria-label": "Email Address" }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                className="login-input"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <div className="login-options">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      disabled={isLoading}
                    />
                  }
                  label="Remember me"
                  className="remember-me"
                />
              )}
            />
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="login-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <Button variant="outlined" startIcon={<Google />} fullWidth>
            Continue with Google
          </Button>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
