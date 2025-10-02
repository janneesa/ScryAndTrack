function ColorStats() {
  return (
    // TODO: Add color stats
    <div className="flex flex-col">
      <p className="mb-1 text-sm text-foreground">Color preference</p>
      <p className="mb-4 text-sm text-muted">
        Color distribuition between all decks
      </p>
      <div className="flex justify-around">
        <img src="/assets/W.svg" alt="White mana" className="w-6 h-6" />
        <img src="/assets/U.svg" alt="Blue mana" className="w-6 h-6" />
        <img src="/assets/B.svg" alt="Black mana" className="w-6 h-6" />
        <img src="/assets/R.svg" alt="Red mana" className="w-6 h-6" />
        <img src="/assets/G.svg" alt="Green mana" className="w-6 h-6" />
      </div>
      <div className="flex justify-around text-sm text-foreground">
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
