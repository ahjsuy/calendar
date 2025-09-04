import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface announcementsType {
  title: string;
  description: string;
  ingredients: string[];
  image: string;
  id: number;
}

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<string>("");
  const handleAnnouncementsFetch = async () => {
    try {
      const announcementsRes = await fetch(
        "https://api.sampleapis.com/coffee/hot"
      );
      const announcementsJSON = await announcementsRes.json();
      setAnnouncements(JSON.stringify(announcementsJSON));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {announcements === "" ? (
        <BeatLoader />
      ) : (
        <div>
          {" "}
          <ul>
            {(JSON.parse(announcements) as announcementsType[]).map((item) => (
              <div>
                <li>title: {item.title}</li>
                <li>description: {item.description}</li>
                <li>ingredients: {item.ingredients}</li>
                <li>image: {item.image}</li>
                <li>id: {item.id}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleAnnouncementsFetch}> GET ANNOUNCEMENTS </button>
    </div>
  );
};

export default AnnouncementsList;
