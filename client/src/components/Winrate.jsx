import { useContext } from "react";
import Card from "../components/utility/Card";
import { UserContext } from "../context/UserContext";
import { Trophy } from "lucide-react";

function Winrate() {
  const { user } = useContext(UserContext);

  return (
    <Card>
      <h2 className="secondary-header flex">
        <span className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-300" />
        </span>
        Winrate
      </h2>
      <p className="secondary-text">Your performance</p>
      <p className="primary-header">{user?.winRate}%</p>
      <p className="secondary-text">Based on all {user?.gamesPlayed} games</p>
    </Card>
  );
}
export default Winrate;
