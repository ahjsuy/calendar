import { GroupType } from "../../util/db_models";

interface Props {
  groups: GroupType[];
}

const Groups = ({ groups }: Props) => {
  return (
    <div className="p-2 w-[20vw]">
      <h2 className="text-2xl m-1">Groups</h2>
      {groups && (
        <ul className="text-lg">
          {groups.map((g) => (
            <li className="flex flex-row hover:bg-slate-300 hover:cursor-pointer">
              <span
                className={`h-[1rem] w-[1rem] inline-block rounded-full m-2 mt-auto mb-auto`}
                style={{ background: g.color }}
              ></span>
              <div className="mr-3">{g.name}</div>
              <span></span>
            </li>
          ))}
        </ul>
      )}
      <div className="text-xs text-secondary-400 hover:cursor-pointer hover:underline">
        + Add more groups to this calendar?
      </div>
    </div>
  );
};

export default Groups;
