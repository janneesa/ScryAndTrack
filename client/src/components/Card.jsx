const Card = ({ children }) => {
  return (
    <div className="flex flex-col max-h-fit gap-1 primary-background px-4 py-2 rounded-lg shadow-md border border-gray-800">
      {children}
    </div>
  );
};

export default Card;
