import { useContext } from "react";
import Card from "../components/utility/Card";
import { UserContext } from "../context/UserContext";
import { Trophy } from "lucide-react";

function Winrate() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="primary-text flex font-semibold text-md">
        <span className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-300" />
        </span>
        Winrate
      </h2>
      <p className="secondary-text text-sm">Your performance</p>
      <p className="primary-text text-xl font-bold">{user?.winRate}%</p>
      <p className="secondary-text text-sm">
        Based on all {user?.gamesPlayed} games
      </p>
    </Card>
  );
}
export default Winrate;
