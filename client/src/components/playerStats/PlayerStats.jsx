import Card from "../utility/Card";
import { Trophy } from "lucide-react";
import ColorStats from "./ColorStats";
import DeckStats from "./DeckStats";

function PlayerStats() {
  return (
    <Card>
      <h2 className="flex items-center text-xl font-semibold text-foreground">
        <span className="flex items-center">
          <Trophy className="mr-2 text-amber-300" />
        </span>
        Player Stats
      </h2>
      <ColorStats />
      <div className="mt-2 mb-2 h-0.5 w-full bg-border/60"></div>
      <DeckStats />
    </Card>
  );
}
export default PlayerStats;
