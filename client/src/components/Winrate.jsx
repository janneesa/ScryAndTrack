import Card from "../components/utility/Card";
import { Trophy } from "lucide-react";

function Winrate() {
  return (
    <Card>
      <h2 className="primary-text flex font-semibold text-md">
        <span className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-300" />
        </span>
        Winrate
      </h2>
      <p className="secondary-text text-sm">Your performance</p>
      <p className="primary-text text-xl font-bold">42%</p>
      <p className="secondary-text text-sm">Based on all 20 games</p>
    </Card>
  );
}
export default Winrate;
