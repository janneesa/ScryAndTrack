function ColorStats() {
  return (
    <div className="flex flex-col">
      <p className="primary-text font-semibold mb-1">Color preference</p>
      <p className="secondary-text text-sm mb-4">
        Color distribuition between all decks
      </p>
      <div className="flex justify-around">
        <img src="/assets/W.svg" alt="White mana" className="w-6 h-6" />
        <img src="/assets/U.svg" alt="Blue mana" className="w-6 h-6" />
        <img src="/assets/B.svg" alt="Black mana" className="w-6 h-6" />
        <img src="/assets/R.svg" alt="Red mana" className="w-6 h-6" />
        <img src="/assets/G.svg" alt="Green mana" className="w-6 h-6" />
      </div>
      <div className="primary-text flex justify-around">
        <p>35%</p>
        <p>35%</p>
        <p>35%</p>
        <p>35%</p>
        <p>35%</p>
      </div>
    </div>
  );
}
export default ColorStats;
