import { useContext, useEffect, useState } from "react";
import { Gamepad2, Users, UserPlus, Trash2, Save } from "lucide-react";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import useFetchAny from "../hooks/useFetchAny";
import Card from "../components/utility/Card";

function NewGame() {
  const { fetchFunction, isLoading, error } = useFetchAny();
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
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers(user?.friends || []);
    } else if (gameType === "playgroup" && playgroup) {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      fetchPlaygroupPlayers();
    } else {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers([]);
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

  const removeLoser = (indexToRemove) => {
    // Don't allow deleting if only one loser remains
    if (losers.length === 1) {
      toast.error("At least 2 players is required.");
      return;
    }

    const updated = losers.filter((_, index) => index !== indexToRemove);
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
      const savedMatch = await toast.promise(
        fetchFunction("/api/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(gameData),
        }),
        {
          loading: "Saving game...",
          success: "Game is now pending for 24h!",
          error: (err) =>
            err?.data?.error || err.message || "Something went wrong",
        }
      );

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
            <UserPlus className="mr-2 h-5 w-5" />
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
              onDelete={() => removeLoser(index)} // optional prop for delete action
              isDeletable={losers.length > 1} // only allow delete if more than one loser
            />
          </div>
        ))}

        <div className="flex justify-center my-2">
          <button
            onClick={handleSaveGame}
            disabled={
              !winner.playerId ||
              !winner.deckId ||
              !losers.every((loser) => loser.playerId && loser.deckId) ||
              isLoading
            }
            className={
              !winner.playerId ||
              !winner.deckId ||
              !losers.every((loser) => loser.playerId && loser.deckId) ||
              isLoading
                ? "button-disabled"
                : "button-white"
            }
          >
            <Save className="mr-2 h-5 w-5" />
            {isLoading ? "Saving..." : "Save Game"}
          </button>
        </div>
      </Card>
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
                <option value={group.id} key={group.id}>
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
  onDelete,
  isDeletable = false,
}) {
  const { user } = useContext(UserContext);
  const { fetchFunction, isLoading } = useFetchAny();
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
          {players?.map(
            (player) =>
              player.id !== user.id && (
                <option value={player.id} key={player.id}>
                  {player.username}
                </option>
              )
          )}
        </select>
      </div>
      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Deck</label>
        <div className="flex gap-2 items-center">
          <select
            className="p-2 rounded-md primary-border"
            onChange={handleDeckChange}
            value={selectedDeck}
            disabled={!decks.length}
          >
            <option value="">{isLoading ? "loading..." : "Select deck"}</option>
            {decks?.map((deck) => (
              <option value={deck.id} key={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>

          {isDeletable && (
            <button
              className="p-2 text-red-600 border cursor-pointer border-zinc-800 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { Gamepad2, Users, UserPlus, Trash2, Save } from "lucide-react";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";
import useFetchAny from "../hooks/useFetchAny";
import Card from "../components/utility/Card";

function NewGame() {
  const { fetchFunction, isLoading } = useFetchAny();
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
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers(user?.friends || []);
    } else if (gameType === "playgroup" && playgroup) {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      fetchPlaygroupPlayers();
    } else {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers([]);
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

  const removeLoser = (index) => {
    if (losers.length === 1) return;
    setLosers((prev) => prev.filter((_, i) => i !== index));
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
      const savedMatch = await toast.promise(
        fetchFunction("/api/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(gameData),
        }),
        {
          loading: "Saving game...",
          success: "Game saved successfully!",
          error: "Failed to save game. Please try again.",
        }
      );

      console.log("Game save response:", savedMatch);
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
          disableDelete
        />

        <div className="w-full h-0.5 bg-zinc-800 mb-2 mt-4" />

        <div className="flex justify-between items-center">
          <p className="secondary-header">Other Players</p>
          <button onClick={addLoser} className="button primary-text">
            <UserPlus className="mr-2 h-5 w-5" />
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
              onDelete={() => removeLoser(index)}
              disableDelete={losers.length === 1}
            />
          </div>
        ))}

        <div className="flex justify-center my-2">
          <button onClick={handleSaveGame} className="button-white">
            <Save className="mr-2 h-5 w-5" />
            Save Game
          </button>
        </div>
      </Card>
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
                <option value={group.id} key={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerSelector({
  players,
  selectedPlayer,
  selectedDeck,
  onSelectionChange,
  onDelete,
  disableDelete,
}) {
  const { user } = useContext(UserContext);
  const { fetchFunction, isLoading } = useFetchAny();
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

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    onSelectionChange(playerId, "");
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
          <option value={user.id}>{user.username} (you)</option>
          {players?.map(
            (player) =>
              player.id !== user.id && (
                <option value={player.id} key={player.id}>
                  {player.username}
                </option>
              )
          )}
        </select>
      </div>

      <div className="flex flex-col w-full">
        <label className="primary-text mb-1">Deck</label>
        <div className="flex gap-4 items-center">
          <select
            className="p-2 rounded-md primary-border"
            onChange={handleDeckChange}
            value={selectedDeck}
            disabled={!decks.length}
          >
            <option value="">{isLoading ? "loading..." : "Select deck"}</option>
            {decks?.map((deck) => (
              <option value={deck.id} key={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
          {!disableDelete && (
            <button
              onClick={onDelete}
              className="px-2 text-red-600 border cursor-pointer border-zinc-800 rounded-lg"
              title="Remove player"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewGame;
