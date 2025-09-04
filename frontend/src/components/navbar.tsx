import PrimaryButton from "./primaryButton";

const Navbar = () => {
  return (
    <div className="bg-secondary-700 w-full sticky top-0 flex place-content-between p-3">
      <div className="flex flex-row place-items-center gap-3 text-white">
        <span className="material-icons-round text-6xl text-white">
          perm_contact_calendar
        </span>
        <h2 className="font-bold text-2xl">CalendShare</h2>
      </div>
      <div className="flex flex-row place-items-center gap-3 text-white">
        <div>Features</div>
        <div>About Us</div>
        <button className="bg-secondary-500 font-semibold p-1 pl-2 pr-2 rounded-full">
          Log In
        </button>
        <button className="bg-accent-500 font-semibold p-1 pl-2 pr-2 rounded-full">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
