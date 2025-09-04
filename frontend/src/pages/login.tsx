import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";

interface loginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [loginForm, setLoginForm] = useState<loginForm>({
    email: "",
    password: "",
  });

  const [isWrongCredentials, setisWrongCredentials] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      const { type, message } = location.state.toast;
      toast[type](message);
    }
  }, [location]);

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("https://localhost:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: loginForm.email.toLowerCase(),
        password: loginForm.password,
      }),
    })
      .then((res) => {
        // throw different error if wrong creds
        if (!res.ok && res.status !== 401) {
          throw new Error("Server Error");
        } else if (!res.ok && res.status === 401) {
          throw new Error("Invalid Credentials");
        }
        navigate("/home");
      })
      .catch((err) => {
        if (err.message === "Invalid Credentials") {
          setisWrongCredentials(true);
          console.log(err.message + " " + err.status);
        } else {
          alert(
            "Something went wrong with the internal server! Please try again later."
          );
          console.log(err.message + " " + err.status);
        }
      });
  };
  return (
    <div className="bg-card-500 h-full flex place-content-center place-items-center">
      <div className="bg-white flex flex-col place-content-center w-[50vw] max-w-[500px] min-w-80 min-h-[480px] p-10 pt-5 border rounded-xl shadow-xl">
        <span className="material-icons-round text-7xl m-0 text-secondary-600">
          perm_contact_calendar
        </span>
        <div className="font-bold text-4xl mt-3 mb-1">
          Log Into Your CalendShare Account
        </div>
        <h2 className="mb-6">Keep track of events, friends, and family.</h2>
        <form
          className="flex flex-col gap-5 mb-3"
          onChange={handleFormChange}
          onSubmit={handleFormSubmission}
        >
          <div>
            <input
              name="email"
              id="email"
              type="text"
              placeholder="Email"
            ></input>
          </div>

          <div>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Password"
            ></input>
            {isWrongCredentials && (
              <p className="text-red-500 mt-1">
                Invalid credentials! Please try again.
              </p>
            )}
          </div>

          <div>
            <button className="bg-secondary-600 mt-3 mb-1 w-full text-white">
              Log In
            </button>
            <div>
              Don't have an account? <Link to="/register"> Sign Up </Link>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Login;
