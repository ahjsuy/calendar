import { GroupType } from "../../util/db_models";

interface Props {
  groups: GroupType[];
}

const Groups = ({ groups }: Props) => {
  return (
    <div className="bg-gray-500 p-2">
      <div className="bg-white">
        {groups && (
          <ul>
            {groups.map((g) => (
              <li>{g.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Groups;
