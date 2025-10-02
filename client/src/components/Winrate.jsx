import { useContext } from "react";
import Card from "../components/utility/Card";
import { UserContext } from "../context/UserContext";
import { Trophy } from "lucide-react";

function Winrate() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="flex items-center text-lg font-semibold text-foreground">
        <span className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-300" />
        </span>
        Winrate
      </h2>
      <p className="text-sm text-muted">Your performance</p>
      <p className="text-xl font-semibold text-foreground">{user?.winRate}%</p>
      <p className="text-sm text-muted">Based on all {user?.gamesPlayed} games</p>
    </Card>
  );
}
export default Winrate;
