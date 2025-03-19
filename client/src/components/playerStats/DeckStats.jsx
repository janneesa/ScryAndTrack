function DeckStats() {
  return (
    <div>
      <p className="primary-text font-semibold">Decks</p>
      <p className="secondary-text text-sm mb-1">Your Commander performance</p>
      <div className="flex flex-col gap-2">
        <Deck />
        <Deck />
        <Deck />
      </div>
    </div>
  );
}
export default DeckStats;

function Deck() {
  return (
    <div className="flex flex-col gap-1">
      <p className="primary-text font-semibold mb-1">Atraxa, Praetors' Voice</p>
      <div className="w-full bg-gray-700 h-2 rounded-md">
        <div className="bg-white h-2 rounded-md" style={{ width: "58%" }}></div>
      </div>
      <p className="text-gray-400 text-sm">7 / 12 wins</p>
    </div>
  );
}
