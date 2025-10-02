const Card = ({ children }) => {
  return (
    <div className="flex flex-col max-h-fit gap-1 rounded-lg border border-border bg-surface px-4 py-2 shadow-md">
      {children}
    </div>
  );
};

export default Card;
