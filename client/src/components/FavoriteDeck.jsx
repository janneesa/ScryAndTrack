import Card from "./Card";
import { WalletCards } from "lucide-react";

function FavoriteDeck() {
  return (
    <Card>
      <h2 className="primary-text flex font-semibold text-md">
        <span className="flex items-center">
          <WalletCards className="mr-2 h-5 w-5 text-blue-500" />
        </span>
        Favorite Deck
      </h2>
      <p className="secondary-text text-sm">Your most used deck</p>
      <p className="primary-text text-xl font-bold">
        Voja, Jaws of the Conclave
      </p>
      <p className="secondary-text text-sm">13 recorded games</p>
    </Card>
  );
}
export default FavoriteDeck;
