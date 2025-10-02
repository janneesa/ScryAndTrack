import { useNavigate } from "react-router-dom";
import FavoriteDeck from "../components/FavoriteDeck";
import FavoritePlaygroup from "../components/FavoritePlaygroup";
import RecentGames from "../components/RecentGames";
import Winrate from "../components/Winrate";
import PlayerStats from "../components/playerStats/PlayerStats";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center spacing-large">
        <button className="button-white" onClick={() => navigate("/newgame")}>
          Create New Game
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 spacing-large">
        <Winrate />
        <FavoriteDeck />
        <FavoritePlaygroup />
      </div>

      {/* Recent Games & Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 spacing-large">
        <RecentGames />
        <PlayerStats />
      </div>
    </>
  );
};

export default Home;
