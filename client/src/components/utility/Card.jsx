const Card = ({ children }) => {
  return (
    <div className="flex flex-col max-h-fit gap-1 primary-background p-4 rounded-lg shadow-md primary-border">
      {children}
    </div>
  );
};

export default Card;
