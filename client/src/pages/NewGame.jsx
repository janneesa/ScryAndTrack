import { useContext, useEffect, useState } from "react";
import { Gamepad2, Users, UserPlus } from "lucide-react";
import { UserContext } from "../context/UserContext";
import Card from "../components/utility/Card";

function NewGame() {
  const { user } = useContext(UserContext);
  const [gameType, setGameType] = useState("free");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (gameType === "free") {
      setPlayers(user?.friends || []);
    }
  }, [gameType]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        {/* Title */}
        <h2 className="primary-header flex">
          <span className="flex items-center">
            <Gamepad2 className="mr-2 primary-text" />
            Game Details
          </span>
        </h2>
        <p className="secondary-text">
          Set the basic information about your Commander game
        </p>

        {/* Game Date & Duration */}
        <div className="mt-2 flex gap-4 primary-text">
          <div className="flex flex-col w-1/2">
            <label className="primary-text mb-1">Game Date</label>
            <input
              type="date"
              className="p-2 rounded-md primary-border focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="primary-text mb-1">Game Duration</label>
            <input
              type="time"
              className="p-2 rounded-md primary-border focus:outline-none"
            />
          </div>
        </div>

        {/* Game Type Selection */}
        <div className="mt-2">
          <label className="primary-text">Game Type</label>
          <div className="mt-2 flex px-1.5 py-1 rounded-l-md primary-border secondary-background max-h-10">
            <button
              onClick={() => setGameType("free")}
              className={`flex items-center justify-center w-1/2 rounded-md ${
                gameType === "free"
                  ? "primary-background primary-text"
                  : "secondary-background secondary-text"
              }`}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Free Game
            </button>
            <button
              onClick={() => setGameType("playgroup")}
              className={`flex items-center justify-center w-1/2 p-3 rounded-md ${
                gameType === "playgroup"
                  ? "primary-background primary-text"
                  : "secondary-background secondary-text"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              Playgroup Game
            </button>
          </div>
          {gameType === "free" ? (
            <p className="secondary-text mt-2">
              Create a game with any of your friends, regardless of playgroup.
            </p>
          ) : (
            <p className="secondary-text mt-2">
              Create a game with your playgroup members only.
            </p>
          )}
        </div>
      </Card>
      <Card>
        {/* Title */}
        <h2 className="primary-header flex">
          <span className="flex items-center">
            <Users className="mr-2 primary-text" />
            Players & Decks
          </span>
        </h2>
        <p className="secondary-text">Who played and what decks were used</p>

        <p className="secondary-header">Winner</p>
        <div className="flex gap-4 justify-center">
          <div className="flex flex-col w-full">
            <PlayerSelector players={players} />
          </div>
        </div>
        <div className="w-full h-0.5 bg-zinc-800 mb-2 mt-2"></div>
        <p className="secondary-header">Other Players</p>
        <PlayerSelector players={players} />
        <PlayerSelector players={players} />
      </Card>
    </div>
  );
}

function PlayerSelector({ players }) {
  return (
    <div className="flex gap-4 justify-center">
      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Player</label>
        <select>
          {players?.map((player) => (
            <option value={player.id} key={player.id}>
              {player.username}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Deck</label>
        <select name="" id="">
          <option value="">Select Deck</option>
          <option value="">Player 1</option>
          <option value="">Player 2</option>
          <option value="">Player 3</option>
        </select>
      </div>
    </div>
  );
}

export default NewGame;
