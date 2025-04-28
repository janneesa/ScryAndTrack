import { useContext, useEffect, useState } from "react";
import { Gamepad2, Users, UserPlus } from "lucide-react";
import { UserContext } from "../context/UserContext";
import useFetchAny from "../hooks/useFetchAny";
import Card from "../components/utility/Card";

function NewGame() {
  const { fetchFunction, error } = useFetchAny();
  const { user } = useContext(UserContext);

  const [gameType, setGameType] = useState("free");
  const [players, setPlayers] = useState([]);
  const [playgroups, setPlaygroups] = useState([]);
  const [playgroup, setPlaygroup] = useState("");
  const [winner, setWinner] = useState({ playerId: "", deckId: "" });
  const [losers, setLosers] = useState([{ playerId: "", deckId: "" }]);

  useEffect(() => {
    setPlaygroups(user?.playgroups || []);
  }, [user]);

  useEffect(() => {
    if (gameType === "free") {
      setPlaygroup("");
      setPlayers(user?.friends || []);
    } else if (gameType === "playgroup" && playgroup) {
      fetchPlaygroupPlayers();
    }
  }, [gameType, playgroup, user]);

  const fetchPlaygroupPlayers = async () => {
    const fetchedPlayers = await fetchFunction(
      `/api/playgroups/players/${playgroup}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setPlayers(fetchedPlayers);
  };

  const addLoser = () => {
    setLosers([...losers, { playerId: "", deckId: "" }]);
  };

  const updateLoser = (index, playerId, deckId) => {
    const updated = [...losers];
    updated[index] = { playerId, deckId };
    setLosers(updated);
  };

  const handleSaveGame = async () => {
    const losersMap = losers.reduce((acc, loser) => {
      if (loser.playerId && loser.deckId) {
        acc[loser.playerId] = loser.deckId;
      }
      return acc;
    }, {});

    const gameData = {
      playgroup,
      winner,
      losers: losersMap,
    };

    try {
      const savedMatch = await fetchFunction("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(gameData),
      });

      console.log("Game save response:", savedMatch);

      // Reset form state after successful save
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlaygroup("");
    } catch (error) {
      console.error("Network or fetch error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <Card>
        <h2 className="primary-header flex">
          <Gamepad2 className="mr-2 primary-text" />
          Game Details
        </h2>
        <p className="secondary-text">
          Set the basic information about your Commander game
        </p>

        <GameMetaForm />

        <GameTypeSelector
          gameType={gameType}
          setGameType={setGameType}
          playgroups={playgroups}
          playgroup={playgroup}
          setPlaygroup={setPlaygroup}
        />
      </Card>

      <Card>
        <h2 className="primary-header flex">
          <Users className="mr-2 primary-text" />
          Players & Decks
        </h2>
        <p className="secondary-text">Who played and what decks were used</p>

        <p className="secondary-header mt-4">Winner</p>
        <PlayerSelector
          players={players}
          selectedPlayer={winner.playerId}
          selectedDeck={winner.deckId}
          onSelectionChange={(playerId, deckId) =>
            setWinner({ playerId, deckId })
          }
        />

        <div className="w-full h-0.5 bg-zinc-800 mb-2 mt-4" />

        <div className="flex justify-between items-center">
          <p className="secondary-header">Other Players</p>
          <button onClick={addLoser} className="button primary-text">
            Add player
          </button>
        </div>

        {losers.map((loser, index) => (
          <div key={index} className="mt-2">
            <PlayerSelector
              players={players}
              selectedPlayer={loser.playerId}
              selectedDeck={loser.deckId}
              onSelectionChange={(playerId, deckId) =>
                updateLoser(index, playerId, deckId)
              }
            />
          </div>
        ))}

        <div className="flex justify-center my-2">
          <button onClick={handleSaveGame} className="button-white">
            Save Game
          </button>
        </div>
      </Card>
    </div>
  );
}

function GameMetaForm() {
  return (
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
  );
}

function GameTypeSelector({
  gameType,
  setGameType,
  playgroups,
  playgroup,
  setPlaygroup,
}) {
  return (
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

      {gameType === "playgroup" && (
        <div className="mt-2 flex gap-4 primary-text">
          <div className="flex flex-col w-full">
            <label className="primary-text mb-1">Playgroup</label>
            <select
              onChange={(e) => setPlaygroup(e.target.value)}
              value={playgroup}
              className="p-2 rounded-md primary-border focus:outline-none"
            >
              <option value="">Select playgroup</option>
              {playgroups?.map((group) => (
                <option value={group._id} key={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <p className="secondary-text mt-2">
        {gameType === "free"
          ? "Create a game with any of your friends, regardless of playgroup."
          : "Create a game with your playgroup members only."}
      </p>
    </div>
  );
}

function PlayerSelector({
  players,
  selectedPlayer,
  selectedDeck,
  onSelectionChange,
}) {
  const { user } = useContext(UserContext);
  const { fetchFunction } = useFetchAny();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const fetchDecks = async () => {
      if (!selectedPlayer) {
        setDecks([]);
        return;
      }

      const fetchedDecks = await fetchFunction(
        `/api/decks/user/${selectedPlayer}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setDecks(fetchedDecks);
    };

    fetchDecks();
  }, [selectedPlayer]);

  const handlePlayerChange = async (e) => {
    const playerId = e.target.value;
    onSelectionChange(playerId, ""); // reset deck on player change
  };

  const handleDeckChange = (e) => {
    onSelectionChange(selectedPlayer, e.target.value);
  };

  return (
    <div className="flex gap-4 justify-center">
      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Player</label>
        <select
          className="p-2 rounded-md primary-border"
          onChange={handlePlayerChange}
          value={selectedPlayer}
        >
          <option value="">Select player</option>
          <option value={user.id} key={user.id}>
            {user.username} (you)
          </option>
          {players?.map((player) => (
            <option value={player.id} key={player.id}>
              {player.username}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Deck</label>
        <select
          className="p-2 rounded-md primary-border"
          onChange={handleDeckChange}
          value={selectedDeck}
          disabled={!decks.length}
        >
          <option value="">Select deck</option>
          {decks?.map((deck) => (
            <option value={deck.id} key={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default NewGame;
