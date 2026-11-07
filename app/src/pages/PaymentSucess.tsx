import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../main";
import { useAppData } from "../context/AppContext";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAppData();
  const called = useRef(false); // stops it running twice in dev

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const verify = async () => {
      const data = params.get("data");
      const token = localStorage.getItem("token");

      if (!data) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.post(
          `${server}/api/payment/verify`,
          { data },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message);
        setUser(res.data.updatedUser);
        navigate("/account");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Verification failed");
        navigate("/");
      }
    };

    verify();
  }, []);

  return (
    <p className="text-center py-24 text-white/60">Verifying your payment...</p>
  );
};

export default PaymentSuccess;