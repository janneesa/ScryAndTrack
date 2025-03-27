import { useState } from "react";
import { Gamepad2, Users, UserPlus } from "lucide-react";
import Card from "../components/utility/Card";

function NewGame() {
  const [gameType, setGameType] = useState("free");

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        {/* Title */}
        <h2 className="primary-text flex text-xl font-semibold">
          <span className="flex items-center">
            <Gamepad2 className="mr-2 primary-text" />
            Game Details
          </span>
        </h2>
        <p className="secondary-text text-sm">
          Set the basic information about your Commander game
        </p>

        {/* Game Date & Duration */}
        <div className="mt-2 flex gap-4 primary-text">
          <div className="flex flex-col w-1/2">
            <label className="primary-text mb-1">Game Date</label>
            <input
              type="date"
              className="p-2 rounded-md border border-gray-700 focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="primary-text mb-1">Game Duration</label>
            <input
              type="time"
              className="p-2 rounded-md border border-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Game Type Selection */}
        <div className="mt-2">
          <label className="primary-text text-sm font-semibold">
            Game Type
          </label>
          <div className="mt-2 flex p-2 rounded-l-md border bg-gray-900">
            <button
              onClick={() => setGameType("free")}
              className={`flex items-center justify-center w-1/2 rounded-md ${
                gameType === "free"
                  ? "primary-background primary-text"
                  : "bg-gray-900 secondary-text"
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
                  : "bg-gray-900 secondary-text"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              Playgroup Game
            </button>
          </div>
          <p className="secondary-text text-xs mt-2">
            Create a game with any of your friends, regardless of playgroup.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default NewGame;
