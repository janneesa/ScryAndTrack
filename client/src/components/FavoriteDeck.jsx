import { useContext } from "react";
import Card from "./utility/Card";
import { WalletCards } from "lucide-react";
import { UserContext } from "../context/UserContext";

function FavoriteDeck() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="flex items-center text-lg font-semibold text-foreground">
        <span className="flex items-center">
          <WalletCards className="mr-2 h-5 w-5 text-blue-500" />
        </span>
        Favorite Deck
      </h2>
      <p className="text-sm text-muted">Your most used deck</p>
      <p className="text-xl font-semibold text-foreground">
        {user?.mostPlayedDeck?.name || "No favorite deck"}
      </p>
      <p className="text-sm text-muted">
        {user?.mostPlayedDeck?.games || 0} recorded games
      </p>
    </Card>
  );
}
export default FavoriteDeck;
