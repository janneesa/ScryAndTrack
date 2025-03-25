import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function DeckStats() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <p className="primary-text font-semibold">Decks</p>
      <p className="secondary-text text-sm mb-1">Your Commander performance</p>
      <div className="flex flex-col gap-2">
        {user?.decks ? (
          user.decks.map((deck, index) => <Deck deck={deck} key={index} />)
        ) : (
          <p className="secondary-text text-sm">No decks created yet</p>
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
        <p className="primary-text font-semibold">
          {deck?.name ? deck?.name : "Deck name missing"}
        </p>
        <p className="secondary-text text-sm mb-1">
          {deck?.commander ? deck?.commander : "Commander name missing"}
        </p>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-md">
        <div
          className="bg-white h-2 rounded-md"
          style={{ width: `${deck?.winRate}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">
        {deck?.wins ? deck?.wins : "0"} / {deck?.games ? deck?.games : "0"} wins
      </p>
    </div>
  );
}
