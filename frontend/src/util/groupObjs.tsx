import { GroupType } from "./db_models";

export const workGroup: GroupType = {
  id: "04c07bbe-7ace-4fc7-aa53-98d2a75ef9ec",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Work",
  color: "#eb836e",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
};

export const friendsGroup: GroupType = {
  id: "7498495b-a170-4b4b-a06c-fd9bc01da98d",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Friends",
  color: "#afeb6e",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
};

export const familyGroup: GroupType = {
  id: "70e8bd44-5852-4680-a358-1690115a4a67",
  owner_id: "c25058e0-bbea-4574-a1b3-00b1ac615064",
  name: "Family",
  color: "#ebbd6e",
  createdAt: new Date(2024, 0, 1, 0, 0, 0).toString(),
};
