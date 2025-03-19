import Card from "./Card";
import { Users } from "lucide-react";

function FavoritePlaygroup() {
  return (
    <Card>
      <h2 className="primary-text flex font-semibold text-md">
        <span className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-green-500" />
        </span>
        Favourite Playgroup
      </h2>
      <p className="secondary-text text-sm">Who you play with most</p>
      <p className="primary-text text-xl font-bold">Perjantai Planeswalkerit</p>
      <p className="secondary-text text-sm">13 recorded games</p>
    </Card>
  );
}
export default FavoritePlaygroup;
