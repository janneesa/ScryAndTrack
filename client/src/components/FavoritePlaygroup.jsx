import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Card from "./utility/Card";
import { Users } from "lucide-react";

function FavoritePlaygroup() {
  const { user } = useContext(UserContext);
  const [mostPlayedPlaygroup, setMostPlayedPlaygroup] = useState(null);

  useEffect(() => {
    if (user) {
      findMostPlayedPlaygroup();
    }
  }, [user]);

  const findMostPlayedPlaygroup = () => {
    let mostPlayedPlaygroup = user?.playgroups[0] ? user.playgroups[0] : null;
    let mostPlayedCount = 0;
    if (user?.playgroups.length === 0) {
      setMostPlayedPlaygroup(null);
      return;
    }
    user?.playgroups.forEach((playgroup) => {
      if (playgroup.matchHistory.length > mostPlayedCount) {
        mostPlayedPlaygroup = playgroup;
        mostPlayedCount = playgroup.matchHistory.length;
      }
    });
    setMostPlayedPlaygroup(mostPlayedPlaygroup);
  };

  return (
    <Card>
      <h2 className="primary-text flex font-semibold text-md">
        <span className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-green-500" />
        </span>
        Favourite Playgroup
      </h2>
      <p className="secondary-text text-sm">Who you play with most</p>
      {mostPlayedPlaygroup ? (
        <>
          <p className="primary-text text-xl font-bold">
            {mostPlayedPlaygroup.name}
          </p>
          <p className="secondary-text text-sm">
            {mostPlayedPlaygroup.matchHistory.length} recorded games
          </p>
        </>
      ) : (
        <p className="primary-text text-xl font-bold">
          No playgroup data available
        </p>
      )}
    </Card>
  );
}
export default FavoritePlaygroup;
