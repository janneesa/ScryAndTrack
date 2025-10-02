import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Card from "./utility/Card";
import WinLabel from "./utility/WinLabel";
import useFetchAny from "../hooks/useFetchAny";
import { CalendarDays, Calendar, Trophy, Users } from "lucide-react";

function RecentGames() {
  const { user } = useContext(UserContext);
  const { fetchFunction, isLoading, error } = useFetchAny();
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchMatches = async () => {
        const fetchedGames = await fetchFunction(`/api/matches/recent`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRecentMatches(fetchedGames);
      };
      fetchMatches();
    }
  }, [user]);

  return (
    <Card>
      <h2 className="primary-header flex">
        <span className="mr-2">
          <Calendar />
        </span>
        Recent Games
      </h2>
      <p className="secondary-text mb-3">Your latest Commander battles</p>
      <div className="space-y-3">
        {user ? (
          <>
            {user.matchHistory.length > 0 ? (
              recentMatches.map((game, index) => (
                <RecentGame game={game} key={index} />
              ))
            ) : (
              <p className="secondary-text">
                No games played yet. Start a new game!
              </p>
            )}
          </>
        ) : (
          <p className="secondary-text">Log in to see your games</p>
        )}
      </div>
    </Card>
  );
}
export default RecentGames;

function RecentGame({ game }) {
  const { user } = useContext(UserContext);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Card>
      <div className="flex">
        <div className="primary-border rounded-full my-auto max-h-fit flex items-center justify-center min-w-12 min-h-12 mr-2">
          <p className="secondary-header mb-1">
            {game?.winner.deckId.name ? game?.winner.deckId.name[0] : "?"}
          </p>
        </div>
        <div>
          <div className="flex flex-col gap-1 p-1">
            <div className="flex gap-4">
              <p className="primary-text">
                {game?.winner.deckId.name
                  ? game?.winner.deckId.name
                  : "Deck missing"}
              </p>
              <WinLabel
                condition={
                  game?.winner.playerId.username === user.username
                    ? true
                    : false
                }
              />
            </div>
            <div className="secondary-text flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center">
                <Trophy className="mr-1 h-4 w-4" />
                Winner:{" "}
                {game?.winner.playerId.username
                  ? game?.winner.playerId.username === user.username
                    ? "You"
                    : game?.winner.playerId.username
                  : "Player missing"}
              </span>
              <span className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {game?.losers ? Object.keys(game.losers).length + 1 : "no"}{" "}
                players
              </span>
              <span className="flex items-center">
                <CalendarDays className="mr-1 h-4 w-4" />
                <p>
                  {game?.createdAt
                    ? formatDate(game.createdAt)
                    : "Timestamp missing"}
                </p>
              </span>
            </div>
            {/* TODO get the possible name of the playgroup */}
            <p className="secondary-text">
              {game?.playgroup?.name ? game?.playgroup?.name : "Free game"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
