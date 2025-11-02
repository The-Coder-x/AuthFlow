import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Login, PersonAdd } from "@mui/icons-material";
import { useState } from "react";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import "./Home.scss";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle theme between light and dark mode
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.setAttribute("data-theme", !isDarkMode ? "dark" : "light");
  };

  return (
    <div
      className="home-container"
      data-theme={isDarkMode ? "dark" : "light"}
      style={{ background: "var(--gradient-subtle)" }}
    >
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </button>
      <div className="text-center max-w-2xl px-6">
        <div
          style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 2rem",
            background: "var(--gradient-primary)",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-primary)",
          }}
        >
          <Login style={{ fontSize: "48px", color: "white" }} />
        </div>

        <h1
          className="mb-4 text-5xl font-bold"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Welcome to AuthFlow
        </h1>
        <p
          className="text-xl mb-8"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          A modern authentication system with beautiful UI and comprehensive
          validation
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Login />}
            onClick={() => navigate("/login")}
            sx={{
              background: "var(--gradient-primary)",
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-primary)",
              transition: "var(--transition-smooth)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(23, 178, 178, 0.35)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => navigate("/signup")}
            sx={{
              padding: "0.875rem 2rem",
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "var(--radius)",
              borderWidth: "2px",
              borderColor: "hsl(var(--primary))",
              color: "hsl(var(--primary))",
              transition: "var(--transition-smooth)",
              "&:hover": {
                borderWidth: "2px",
                borderColor: "hsl(var(--primary))",
                background: "hsla(var(--primary), 0.05)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
