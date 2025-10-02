import { useContext } from "react";
import Card from "./utility/Card";
import { WalletCards } from "lucide-react";
import { UserContext } from "../context/UserContext";

function FavoriteDeck() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="secondary-header flex">
        <span className="flex items-center">
          <WalletCards className="mr-2 h-5 w-5 text-blue-500" />
        </span>
        Favorite Deck
      </h2>
      <p className="secondary-text">Your most used deck</p>
      <p className="primary-header">
        {user?.mostPlayedDeck?.name || "No favorite deck"}
      </p>
      <p className="secondary-text">
        {user?.mostPlayedDeck?.games || 0} recorded games
      </p>
    </Card>
  );
}
export default FavoriteDeck;
