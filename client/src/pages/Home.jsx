import { useNavigate } from "react-router-dom";
import FavoriteDeck from "../components/FavoriteDeck";
import FavoritePlaygroup from "../components/FavoritePlaygroup";
import RecentGames from "../components/RecentGames";
import Winrate from "../components/Winrate";
import PlayerStats from "../components/playerStats/PlayerStats";

const Home = () => {
  const navigate = useNavigate();

  const navigateToNewGame = () => {
    navigate("/newgame");
  };

  return (
    <div className="">
      <div className="mb-4 flex justify-center">
        <button
          onClick={navigateToNewGame}
          className="flex max-w-fit items-center justify-center rounded-lg bg-white px-4 py-2 font-semibold text-black shadow-md transition hover:scale-105"
        >
          Create New Game
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Winrate />
        <FavoriteDeck />
        <FavoritePlaygroup />
      </div>

      {/* Recent Games & Player Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RecentGames />
        <PlayerStats />
      </div>
    </div>
  );
};

export default Home;
