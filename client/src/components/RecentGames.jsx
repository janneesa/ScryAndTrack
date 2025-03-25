import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Card from "./utility/Card";
import { CalendarDays, Calendar, Trophy, Users } from "lucide-react";

function RecentGames() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="primary-text flex text-xl font-semibold">
        <span className="mr-2">
          <Calendar />
        </span>
        Recent Games
      </h2>
      <p className="secondary-text text-sm mb-3">
        Your latest Commander battles
      </p>
      <div className="space-y-3">
        {user ? (
          <>
            {user.matchHistory.length > 0 ? (
              user.matchHistory.map((game, index) => (
                <RecentGame game={game} key={index} />
              ))
            ) : (
              <p className="secondary-text text-sm">
                No games played yet. Start a new game!
              </p>
            )}
          </>
        ) : (
          <p className="secondary-text text-sm">Log in to see your games</p>
        )}
      </div>
    </Card>
  );
}
export default RecentGames;

function RecentGame({ game }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="primary-background rounded-md border-gray-800 border flex">
      <div className="border border-gray-800 rounded-full my-auto px-4 py-2 ml-2 max-h-fit flex items-center justify-center w-12 h-12">
        <p className="text-3xl primary-text mb-1">
          {game?.winner.deckId.name ? game?.winner.deckId.name[0] : "?"}
        </p>
      </div>
      <div>
        <div className="flex flex-col gap-1 p-3">
          <div>
            <p className="primary-text font-semibold">
              {game?.winner.deckId.name
                ? game?.winner.deckId.name
                : "Deck missing"}
            </p>
          </div>
          <div className="secondary-text flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center">
              <Trophy className="mr-1 h-4 w-4" />
              Winner:{" "}
              {game?.winner.playerId.username
                ? game?.winner.playerId.username
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
                {game?.timestamp
                  ? formatDate(game.timestamp)
                  : "Timestamp missing"}
              </p>
            </span>
          </div>
          <p className="secondary-text text-sm">Perjantai Planeswalkerit</p>
        </div>
      </div>
    </div>
  );
}
