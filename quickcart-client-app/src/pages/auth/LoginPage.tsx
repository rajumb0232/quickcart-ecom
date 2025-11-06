import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/form/Input";
import SensitiveInput from "../../components/form/SensitiveInput";
import BlackButton from "../../components/form/BlackButton";
import LinkButton from "../../components/form/LinkButton";
import { FaOpencart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin, useRegister } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShowCategories } from "../../features/util/screenSlice";

interface AuthPageProps {
  modal?: boolean;
}

export default function AuthPage({ modal = true }: AuthPageProps) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowCategories(false))
  },[])

  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (mode === "login") {
      login.mutate(credentials, {
        onSuccess: (data) => {
          if (data.success) {
            // Redirect to where they came from, or home
            const from = (location.state as any)?.from?.pathname || "/";
            navigate(from, { replace: true });
            toast.success("Logged in successfully!");
          }
        },
      });
    } else {
      register.mutate(credentials, {
        onSuccess: (data) => {
          if (data.success) {
            setMode("login");
            toast.success("Registered successfully!");
          }
        },
      });
    }
  };

  const currentMutation = mode === "login" ? login : register;

  const image =
    mode === "login"
      ? "https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI2fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1200"
      : "https://images.unsplash.com/photo-1716951918731-77d7682b4e63?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=1200";

  const closeModal = () => navigate("/");

  const FormSection = (
    <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-16 bg-white relative">
      {!modal && (
        <a
          href="/"
          className="m-auto top-0 absolute p-4 text-3xl font-semibold left-0 flex flex-row justify-center items-center"
        >
          <FaOpencart />
          <span className="ml-2 text-2xl">Quickcart e-com</span>
        </a>
      )}
      <div className="w-full max-w-md mt-8 md:mt-0">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          {mode === "login" ? "Login to your account" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email address"
          />
          <SensitiveInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter Password"
          />
          {mode === "login" && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          <BlackButton
            label={
              currentMutation.isPending
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Sign up"
            }
            type="submit"
            disabled={currentMutation.isPending} // ✅ Already prevents multiple clicks
          />
          <div className="text-center text-sm text-gray-600 mt-4">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <LinkButton
                  label="Sign up now"
                  onClick={() => setMode("register")}
                />
              </>
            ) : (
              <>
                Already have an account?{" "}
                <LinkButton label="Sign in" onClick={() => setMode("login")} />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  // ImageSection: add key and loading attr
  const ImageSection = (
    <div className="hidden md:flex w-1/2 h-full min-h-[400px] ">
      <img
        key={image} // ensures correct update but not unnecessary remounts
        src={image}
        alt="auth side"
        loading="eager" // or "lazy" depending on UX; eager reduces flash
        className="object-cover w-full h-full rounded-r-2xl"
      />
    </div>
  );

  return (
    <div
      className={
        modal
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs transition-all"
          : "flex flex-col md:flex-row min-h-screen"
      }
    >
      <AnimatePresence mode="wait">
        {modal ? (
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
          >
            {/* MOVE close button to overlay so it's always visible on mobile */}
            <button
              onClick={closeModal}
              // visible, clickable, respects notch/safe-area and above the panel
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}
              className="absolute right-4 z-50 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-xl shadow-md text-gray-700"
              aria-label="close"
            >
              ✕
            </button>

            <motion.div
              key="auth-panel"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="relative bg-white w-[90%] md:h-[70%] md:w-[800px] md:max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row"
            >
              {FormSection}
              {ImageSection}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="auth-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col md:flex-row min-h-screen"
          >
            {FormSection}
            {ImageSection}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
