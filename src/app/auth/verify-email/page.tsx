"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred during verification");
    }
  };

  const handleResendEmail = async () => {
    // This would need the user's email - you might want to add an input field
    setResending(true);
    // Implementation for resending email
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Loader2 className="w-16 h-16 text-primary-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">
                Verifying Your Email
              </h1>
              <p className="text-dark-600">Please wait...</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="mb-6"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </motion.div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">
                Email Verified! 🎉
              </h1>
              <p className="text-dark-600 mb-6">{message}</p>
              <p className="text-sm text-dark-500 mb-4">
                Redirecting you to sign in...
              </p>
              <Link href="/auth/signin">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="mb-6"
              >
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              </motion.div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-dark-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-dark-600 mt-6 text-sm">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Contact Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
