import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";

interface userForm {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

interface formErrors {
  email: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

const Register = () => {
  const [userForm, setUserForm] = useState<userForm>({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const [inputErrors, setInputErrors] = useState<formErrors>({
    email: false,
    password: false,
    passwordConfirm: false,
  });

  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFormErrors: formErrors = {
      email: !userForm.email.includes("@"),
      password: userForm.password.length < 6,
      passwordConfirm: userForm.password !== userForm.passwordConfirm,
    };

    if (
      !newFormErrors.email &&
      !newFormErrors.password &&
      !newFormErrors.passwordConfirm
    ) {
      // submit it
      fetch("https://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: userForm.email.toLowerCase(),
          password: userForm.password,
          username: userForm.username,
        }),
      })
        .then((res) => {
          if (!res.ok && res.status === 409) {
            return res.json().then((err) => {
              throw new Error("Account already exists!");
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("Success:", data);
          // create a master calendar automatically
          // redirect to the log in page
          fetch("https://localhost:8081/api/calendars/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: `${userForm.username}'s Master Calendar`,
              description: "Default Master Calendar",
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(res.status.toString());
              }
            })
            .then((res) => {
              navigate("/login", {
                state: {
                  toast: {
                    type: "success",
                    message: "Account Registered Successfully!",
                  },
                },
              });
            })
            .catch((err) => console.log(err.message));
        })
        .catch((err) => {
          console.error("Error:", err.message);
          alert(err.message);
        });
    }
    setInputErrors(newFormErrors);
  };

  return (
    <div className="bg-card-500 h-full flex place-content-center place-items-center">
      <div className="bg-white flex flex-col place-content-center w-[50vw] max-w-[500px] min-w-80 min-h-[480px] p-10 pt-5 border rounded-xl shadow-xl">
        <span className="material-icons-round text-7xl m-0 text-secondary-600">
          perm_contact_calendar
        </span>
        <div className="font-bold text-4xl mt-3 mb-1">
          Create Your CalendShare Account
        </div>
        <h2 className="mb-6">Start organizing your life today.</h2>
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
              className={
                inputErrors.email ? "border-red-500" : "border-gray-300"
              }
            ></input>
            {inputErrors.email && (
              <p className="text-red-500 text-sm mt-1 justify-self-start">
                Please enter a valid email.
              </p>
            )}
          </div>
          <div>
            <input
              name="username"
              id="username"
              type="username"
              placeholder="Username"
            ></input>
          </div>
          <div>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Password"
              className={
                inputErrors.password ? "border-red-500" : "border-gray-300"
              }
            ></input>
            {inputErrors.password && (
              <p className="text-red-500 text-sm mt-1 justify-self-start">
                Please enter a valid password longer than 6 characters.
              </p>
            )}
          </div>
          <div>
            <input
              name="passwordConfirm"
              id="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              className={
                inputErrors.passwordConfirm
                  ? "border-red-500"
                  : "border-gray-300"
              }
            ></input>
            {inputErrors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1 justify-self-start">
                Passwords do not match.
              </p>
            )}
          </div>
          <div>
            <button className="bg-secondary-600 mt-3 mb-1 w-full text-white">
              Sign Up
            </button>
            <div>
              Already have an account? <Link to="/login"> Log In </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
