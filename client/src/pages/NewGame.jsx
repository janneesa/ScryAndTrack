import { useCallback, useContext, useEffect, useState } from "react";
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

  const primaryButtonClasses =
    "flex cursor-pointer items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground shadow-md transition hover:bg-surface hover:scale-105";
  const disabledButtonClasses =
    "flex max-w-fit cursor-not-allowed items-center justify-center rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-muted";
  const ctaButtonClasses =
    "flex max-w-fit items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:scale-105";

  useEffect(() => {
    setPlaygroups(user?.playgroups || []);
  }, [user]);

  const fetchPlaygroupPlayers = useCallback(async () => {
    if (!playgroup) {
      setPlayers([]);
      return;
    }

    try {
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
    } catch (err) {
      console.error("Failed to fetch playgroup players:", err);
      toast.error("Unable to load playgroup players. Please try again.");
    }
  }, [fetchFunction, playgroup, user?.token]);

  useEffect(() => {
    if (gameType === "free") {
      setPlaygroup("");
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers(user?.friends || []);
    } else if (gameType === "playgroup") {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      fetchPlaygroupPlayers();
    } else {
      setWinner({ playerId: "", deckId: "" });
      setLosers([{ playerId: "", deckId: "" }]);
      setPlayers([]);
    }
  }, [fetchPlaygroupPlayers, gameType, playgroup, user]);

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

  const isSaveDisabled =
    !winner.playerId ||
    !winner.deckId ||
    !losers.every((loser) => loser.playerId && loser.deckId) ||
    isLoading;

  const saveButtonClasses = isSaveDisabled
    ? disabledButtonClasses
    : ctaButtonClasses;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Card>
        <h2 className="flex items-center text-xl font-semibold text-foreground">
          <Gamepad2 className="mr-2 h-5 w-5 text-foreground" />
          Game Details
        </h2>
        <p className="text-sm text-muted">
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
        <h2 className="flex items-center text-xl font-semibold text-foreground">
          <Users className="mr-2 h-5 w-5 text-foreground" />
          Players & Decks
        </h2>
        <p className="text-sm text-muted">Who played and what decks were used</p>

        <p className="mt-4 text-lg font-semibold text-foreground">Winner</p>
        <PlayerSelector
          players={players}
          selectedPlayer={winner.playerId}
          selectedDeck={winner.deckId}
          onSelectionChange={(playerId, deckId) =>
            setWinner({ playerId, deckId })
          }
        />

        <div className="mt-4 mb-2 h-0.5 w-full bg-border/60" />

        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-foreground">Other Players</p>
          <button
            onClick={addLoser}
            className={`${primaryButtonClasses} max-w-fit`}
          >
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

        <div className="my-2 flex justify-center">
          <button
            onClick={handleSaveGame}
            disabled={isSaveDisabled}
            className={saveButtonClasses}
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
      <label className="text-sm text-foreground">Game Type</label>
      <div className="mt-2 flex max-h-10 rounded-md border border-border bg-surface px-1.5 py-1">
        <button
          onClick={() => setGameType("free")}
          className={`flex w-1/2 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition ${
            gameType === "free"
              ? "bg-background text-foreground hover:bg-background/80"
              : "bg-surface text-muted hover:bg-surface/80"
          }`}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Free Game
        </button>
        <button
          onClick={() => setGameType("playgroup")}
          className={`flex w-1/2 items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition ${
            gameType === "playgroup"
              ? "bg-background text-foreground hover:bg-background/80"
              : "bg-surface text-muted hover:bg-surface/80"
          }`}
        >
          <Users className="mr-2 h-5 w-5" />
          Playgroup Game
        </button>
      </div>

      {gameType === "playgroup" && (
        <div className="mt-2 flex gap-4 text-sm text-foreground">
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm text-foreground">Playgroup</label>
            <select
              onChange={(e) => setPlaygroup(e.target.value)}
              value={playgroup}
              className="rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-border/60"
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

      <p className="mt-2 text-sm text-muted">
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

      try {
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
      } catch (err) {
        console.error("Failed to fetch decks:", err);
        toast.error("Unable to load decks for the selected player.");
        setDecks([]);
      }
    };

    fetchDecks();
  }, [selectedPlayer, fetchFunction, user?.token]);

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    onSelectionChange(playerId, "");
  };

  const handleDeckChange = (e) => {
    onSelectionChange(selectedPlayer, e.target.value);
  };

  return (
    <div className="flex justify-center gap-4">
      <div className="flex w-full flex-col">
        <label className="mb-1 text-sm text-foreground">Player</label>
        <select
          className="rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-border/60"
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
      <div className="flex w-full flex-col">
        <label className="mb-1 text-sm text-foreground">Deck</label>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-border/60"
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
              type="button"
              className="rounded-lg border border-border p-2 text-red-500 transition hover:bg-surface"
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

export default NewGame;

