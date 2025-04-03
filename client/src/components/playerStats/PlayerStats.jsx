import Card from "../utility/Card";
import { Trophy } from "lucide-react";
import ColorStats from "./ColorStats";
import DeckStats from "./DeckStats";

function PlayerStats() {
  return (
    <Card>
      <h2 className="primary-header flex">
        <span className="flex items-center">
          <Trophy className="mr-2 text-amber-300" />
        </span>
        Player Stats
      </h2>
      <ColorStats />
      <div className="w-full h-0.5 bg-gray-zinc mb-2 mt-2"></div>
      <DeckStats />
    </Card>
  );
}
export default PlayerStats;
