interface Props {
  currentDate: Date;
  view: string;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarHeader = ({ currentDate, view, setDate, setView }: Props) => {
  const handleDateChange = (view: string, dateDifference: number) => {
    switch (view) {
      case "month":
        setDate(
          (prev) =>
            new Date(prev.getFullYear(), prev.getMonth() + dateDifference, 1)
        );
        break;
      case "week":
        setDate(
          (prev) =>
            new Date(prev.getFullYear() + dateDifference, prev.getMonth(), 1)
        );
      default:
        console.error("Something went wrong with views while changing dates");
    }
  };

  return (
    <div className="flex flex-row place-items-center">
      <div
        className="bg-white rounded-full p-1 w-fit h-[1.5rem] cursor-pointer"
        onClick={() => {
          handleDateChange(view, -1);
        }}
      >
        {" "}
        <span className="material-icons-round text-gray-400 text-md m-0 p-0">
          arrow_back_ios
        </span>{" "}
      </div>
      <div className="place-content-center m-2 ml-1 mr-1">
        <h2 className="text-4xl m-3">
          {currentDate.toLocaleString("default", { month: "long" })}
        </h2>
      </div>
      <div
        className="bg-white rounded-full p-1 w-fit h-[1.5rem] cursor-pointer"
        onClick={() => {
          handleDateChange(view, 1);
        }}
      >
        {" "}
        <span className="material-icons-round text-gray-400 ">
          arrow_forward_ios
        </span>{" "}
      </div>
      <button
        className="bg-secondary-400 text-white ml-5 rounded-full"
        onClick={() => setDate(new Date())}
      >
        {" "}
        Today{" "}
      </button>
      {/* <form>
        <select
          name="view"
          id="view"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setView(e.target.value);
          }}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </form> */}
    </div>
  );
};

export default CalendarHeader;
