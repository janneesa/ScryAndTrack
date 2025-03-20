import Card from "./utility/Card";
import { CalendarDays, Calendar, Trophy, Users } from "lucide-react";

function RecentGames() {
  return (
    <Card>
      <h2 className="primary-text flex text-xl font-semibold">
        <span className="mr-2">
          <Calendar />
        </span>
        Recent Games
      </h2>
      <p className="secondary-text text-sm mb-3">
        Your latest Commander battles
      </p>
      <div className="space-y-3">
        <RecentGame />
        <RecentGame />
      </div>
    </Card>
  );
}
export default RecentGames;

function RecentGame() {
  return (
    <div className="primary-background flex flex-col gap-1 p-3 rounded-md border-gray-800 border">
      <div>
        <p className="primary-text font-semibold">Atraxa, Praetors' Voice</p>
      </div>
      <div className="secondary-text flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center">
          <Trophy className="mr-1 h-4 w-4" />
          Winner: You
        </span>
        <span className="flex items-center">
          <Users className="mr-1 h-4 w-4" />4 players
        </span>
        <span className="flex items-center">
          <CalendarDays className="mr-1 h-4 w-4" />
          {new Date().toLocaleDateString()}
        </span>
      </div>
      <p className="secondary-text text-sm">Perjantai Planeswalkerit</p>
    </div>
  );
}
