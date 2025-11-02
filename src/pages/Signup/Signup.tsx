import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Google,
  CheckCircle,
  Refresh,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./Signup.scss";
import { EMAIL_REGEX } from "@/constants/common-constants";

//Signup form validation schema
const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .nonempty("Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be less than 30 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z
      .string()
      .trim()
      .nonempty("Email is required")
      .regex(EMAIL_REGEX, "Please enter a valid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must be at most 15 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must contain at least one special character"
      )
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

//Generate a random password 
const generateRandomPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "@#$%^&*()_+-=[]{}";

  const length = 12;
  let password = "";

  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];

  const allChars = uppercase + lowercase + digits + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

//Check if password contains repeated patterns
const hasRepeatedPatterns = (password: string): boolean => {
 
  // Check for 3+ consecutive repeated characters
  if (/(.)\1{2,}/.test(password)) return true;

  // Check for repeated sequences of 2+ characters
  for (let i = 0; i < password.length - 3; i++) {
    const pattern = password.substring(i, i + 2);
    if (password.indexOf(pattern, i + 2) !== -1) return true;
  }

  return false;
};

//Calculate password strength based on specific criteria
const getPasswordStrength = (
  password: string,
  fullName: string
): "weak" | "medium" | "strong" => {
  if (!password) return "weak";

  // Weak conditions
  if (hasRepeatedPatterns(password)) return "weak";
  if (
    fullName &&
    password.toLowerCase().includes(fullName.toLowerCase().replace(/\s/g, ""))
  ) {
    return "weak";
  }

  // Count digits and special characters
  const digitCount = (password.match(/[0-9]/g) || []).length;
  const specialCount = (
    password.match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []
  ).length;

  // Strong conditions (13-15 chars)
  if (password.length >= 13 && password.length <= 15) {
    return "strong";
  }

  // Medium conditions (9-12 chars, <=3 digits, <=2 special chars)
  if (
    password.length >= 9 &&
    password.length <= 12 &&
    digitCount <= 3 &&
    specialCount <= 2
  ) {
    return "medium";
  }

  // If password passes basic validation but doesn't meet medium/strong criteria
  if (password.length >= 8 && password.length <= 15) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (hasUpper && hasLower && hasDigit && hasSpecial) {
      return "medium";
    }
  }

  return "weak";
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password and fullName fields for strength calculation
  const watchPassword = watch("password");
  const watchFullName = watch("fullName");

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute("data-theme", !isDarkMode ? "dark" : "light");
  };

  // Update password strength indicator on password or name change
  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(getPasswordStrength(watchPassword, watchFullName));
    }
  }, [watchPassword, watchFullName]);

  // Generate and set a random password suggestion
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setValue("password", newPassword);
    setValue("confirmPassword", newPassword);
  };

  // Validates data and Handle form submission
  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);

      // Simulate API call (replace with actual registration logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.error("Signup error:", error);

      setIsLoading(false);
    }
  };

  // Show success animation if registration completed
  if (isSuccess) {
    return (
      <div
        className="signup-container"
        data-theme={isDarkMode ? "dark" : "light"}
      >
        <div className="signup-card">
          <div className="success-animation">
            <div className="success-icon">
              <CheckCircle />
            </div>
            <h2>Account Created!</h2>
            <p>Your account has been successfully created.</p>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="signup-container"
      data-theme={isDarkMode ? "dark" : "light"}
    >
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </button>

      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-logo">
            <PersonAdd />
          </div>
          <h1>Create Account</h1>
          <p>Join us today and get started</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                type="text"
                variant="outlined"
                fullWidth
                className="signup-input"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                autoComplete="name"
                disabled={isLoading}
              />
            )}
          />

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
                className="signup-input"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
              />
            )}
          />

          <div>
            <div className="password-input-wrapper">
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
                    className="signup-input"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    autoComplete="new-password"
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
              <button
                type="button"
                className="generate-password-btn"
                onClick={handleGeneratePassword}
                disabled={isLoading}
                aria-label="Generate random password"
              >
                <Refresh /> Generate
              </button>
            </div>

            {watchPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`} />
                </div>
                <span className={`strength-text ${passwordStrength}`}>
                  Password strength: {passwordStrength}
                </span>
              </div>
            )}
          </div>

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                className="signup-input"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="signup-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="signup-divider">
          <span>Or sign up with</span>
        </div>

        <div className="social-buttons">
          <Button
            variant="outlined"
            startIcon={<Google />}
            disabled={isLoading}
            fullWidth
          >
            Google
          </Button>
        </div>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
