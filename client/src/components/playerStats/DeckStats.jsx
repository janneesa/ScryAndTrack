import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function DeckStats() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <p className="mb-1 text-sm text-foreground">Decks</p>
      <p className="mb-2 text-sm text-muted">Your Commander performance</p>
      <div className="flex flex-col gap-2">
        {user?.decks ? (
          user.decks.map((deck, index) => <Deck deck={deck} key={index} />)
        ) : (
          <p className="text-sm text-muted">No decks created yet</p>
        )}
      </div>
    </div>
  );
}
export default DeckStats;

function Deck({ deck }) {
  return (
    <div className="flex flex-col gap-1">
      <div>
        <p className="text-sm text-foreground">
          {deck?.name ? deck?.name : "Deck name missing"}
        </p>
        <p className="text-sm text-muted">
          {deck?.commander ? deck?.commander : "Commander name missing"}
        </p>
      </div>

      <div className="h-2 w-full rounded-md bg-border/60">
        <div
          className="h-2 rounded-md bg-white"
          style={{ width: `${deck?.winRate}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted">
        {deck?.wins ? deck?.wins : "0"} / {deck?.games ? deck?.games : "0"} wins
      </p>
    </div>
  );
}
