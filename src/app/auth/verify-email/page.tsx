"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const verified = searchParams.get("verified");
  const error = searchParams.get("error");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle email button verification
  useEffect(() => {
    if (verified === "true" && email) {
      setShowSuccess(true);
      toast.success("Email verified!");

      // Try auto-login with stored credentials
      const pendingVerification = sessionStorage.getItem("pendingVerification");

      if (pendingVerification) {
        try {
          const {
            email: storedEmail,
            password,
            timestamp,
          } = JSON.parse(pendingVerification);

          // Check if email matches and data is not older than 24 hours
          if (
            storedEmail === email &&
            Date.now() - timestamp < 24 * 60 * 60 * 1000
          ) {
            // Auto-login
            signIn("credentials", {
              redirect: false,
              email: storedEmail,
              password,
            }).then((result) => {
              sessionStorage.removeItem("pendingVerification");

              if (result?.ok) {
                setTimeout(() => {
                  router.push("/dashboard");
                  router.refresh();
                }, 2000);
              } else {
                // Redirect to signin if auto-login fails
                setTimeout(() => {
                  router.push(
                    `/auth/signin?verified=true&email=${encodeURIComponent(
                      email
                    )}`
                  );
                }, 2000);
              }
            });
            return;
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }

      // Fallback: redirect to signin
      setTimeout(() => {
        router.push(
          `/auth/signin?verified=true&email=${encodeURIComponent(email)}`
        );
      }, 2000);
    } else if (error) {
      const errorMessages: Record<string, string> = {
        "missing-token": "Verification link is invalid",
        "invalid-token": "Invalid verification token",
        "expired-token": "Verification link has expired",
        "server-error": "An error occurred. Please try again.",
      };
      toast.error(errorMessages[error] || "Verification failed");
    }
  }, [verified, error, email, router]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0] && !verified && !error) {
      inputRefs.current[0].focus();
    }
  }, [verified, error]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (index === 5 && value && newCode.every((digit) => digit)) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setShowSuccess(true);
        toast.success("Email verified! Logging you in...");

        // Get stored credentials from session storage
        const pendingVerification = sessionStorage.getItem(
          "pendingVerification"
        );

        if (pendingVerification) {
          try {
            const { email, password, timestamp } =
              JSON.parse(pendingVerification);

            // Check if data is not older than 24 hours
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
              // Auto-login with stored credentials
              const signInResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
              });

              // Clear stored credentials
              sessionStorage.removeItem("pendingVerification");

              if (signInResult?.ok) {
                // Redirect to dashboard
                setTimeout(() => {
                  router.push("/dashboard");
                  router.refresh();
                }, 1500);
                return;
              }
            }
          } catch (error) {
            console.error("Auto-login failed:", error);
          }
        }

        // Fallback: redirect to signin if auto-login fails
        toast.success("Please sign in to continue");
        setTimeout(() => {
          router.push(
            `/auth/signin?verified=true&email=${encodeURIComponent(
              data.user.email
            )}`
          );
        }, 2000);
      } else {
        toast.error(data.error || "Invalid verification code");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification code sent!");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(data.error || "Failed to resend code");
      }
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>

                <h1 className="text-3xl font-bold text-dark-900 mb-2">
                  Email Verified! 🎉
                </h1>
                <p className="text-dark-600 mb-6">
                  Welcome to Halo Hair Lounge
                  {userData?.name ? `, ${userData.name}` : ""}!
                </p>
                <div className="flex items-center justify-center space-x-2 text-primary-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm">Taking you to your dashboard...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
                  >
                    <Mail className="w-8 h-8 text-primary-600" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-dark-600">We've sent a 6-digit code to</p>
                  <p className="font-semibold text-dark-900 mt-1">{email}</p>
                </div>

                {/* Code Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark-700 mb-3 text-center">
                    Enter Verification Code
                  </label>
                  <div
                    className="flex justify-center gap-2"
                    onPaste={handlePaste}
                  >
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isVerifying}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-dark-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-dark-500 text-center mt-3">
                    Paste the code or enter it manually
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  onClick={() => handleVerify(code.join(""))}
                  disabled={code.some((digit) => !digit) || isVerifying}
                  className="w-full mb-4"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-dark-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>

                {/* Help Link */}
                <div className="mt-6 pt-6 border-t border-dark-200 text-center">
                  <p className="text-sm text-dark-600">
                    Wrong email?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Sign up again
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!showSuccess && (
          <p className="text-center text-dark-600 mt-6 text-sm">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
