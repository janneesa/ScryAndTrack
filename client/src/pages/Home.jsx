import { useNavigate } from "react-router-dom";
import FavoriteDeck from "../components/FavoriteDeck";
import FavoritePlaygroup from "../components/FavoritePlaygroup";
import RecentGames from "../components/RecentGames";
import Winrate from "../components/Winrate";
import PlayerStats from "../components/playerStats/PlayerStats";

const Home = () => {
  const navigate = useNavigate();

  const navigateToNewGame = () => {
    navigate("/newGame");
  };

  return (
    <div className="">
      <div className="flex justify-center mb-4">
        <button onClick={navigateToNewGame} className="button-white">
          Create New Game
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Winrate />
        <FavoriteDeck />
        <FavoritePlaygroup />
      </div>

      {/* Recent Games & Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <RecentGames />
        <PlayerStats />
      </div>
    </div>
  );
};

export default Home;
