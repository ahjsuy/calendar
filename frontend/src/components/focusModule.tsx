import { ReactElement } from "react";

interface Props {
  children: ReactElement;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  ref: React.RefObject<any>;
}

const FocusModule = ({ children, expanded, setExpanded, ref }: Props) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out  ${
        expanded ? `event-button-expanded` : `event-button`
      }`}
      ref={ref}
    >
      {expanded && (
        <div
          className="absolute right-[1rem] top-[.5rem] text-gray-400 cursor-pointer z-50"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.stopPropagation();
            setExpanded(false);
          }}
        >
          <span className="material-icons-round">close</span>
        </div>
      )}
      {expanded && children}
    </div>
  );
};

export default FocusModule;
