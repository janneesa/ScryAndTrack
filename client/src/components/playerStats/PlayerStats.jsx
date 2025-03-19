import Card from "../Card";
import { Trophy } from "lucide-react";
import ColorStats from "./ColorStats";
import DeckStats from "./DeckStats";

function PlayerStats() {
  return (
    <Card>
      <h2 className="primary-text flex text-xl font-semibold">
        <span className="flex items-center">
          <Trophy className="mr-2 text-amber-300" />
        </span>
        Player Stats
      </h2>
      <ColorStats />
      <div className="w-full h-0.5 bg-gray-800 mb-1 mt-1"></div>
      <DeckStats />
    </Card>
  );
}
export default PlayerStats;
