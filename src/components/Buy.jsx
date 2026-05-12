import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { BACKEND_URL } from "../utils/utils";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;  //using optional chaining to avoid crashing incase token is not there!!!

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  if (!token) {
    navigate("/login");
  }


  useEffect(() => {
    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:4001/api/v1/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Include cookies if needed
          }
        );
        console.log(response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("you have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors);
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("your payment id: ", paymentIntent.id);
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);
      await axios
        .post(`http://localhost:4001/api/v1/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error in making payment");
        });
      toast.success("Payment Successful");
      navigate("/purchases");
    }
    setLoading(false);
  };
  return (
    <>
      {error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="px-6 py-4 text-red-700 bg-red-100 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="flex items-center justify-center w-full py-2 mt-3 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="container flex flex-col mx-auto my-40 sm:flex-row">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center mt-4 space-x-2 text-center">
              <h2 className="text-sm text-gray-600">Total Price</h2>
              <p className="font-bold text-red-500">${course.price}</p>
            </div>
            <div className="flex items-center space-x-2 text-center">
              <h1 className="text-sm text-gray-600">Course name</h1>
              <p className="font-bold text-red-500">{course.title}</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full md:w-1/2">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm text-gray-700"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="w-full py-2 mt-8 text-white transition duration-200 bg-indigo-500 rounded-md hover:bg-indigo-600"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-xs font-semibold text-red-500">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="flex items-center justify-center w-full py-2 mt-3 text-white transition duration-200 bg-orange-500 rounded-md hover:bg-orange-600">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;
