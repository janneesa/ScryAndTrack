import { Crown, Skull } from "lucide-react";

const WinLabel = ({ condition }) => {
  return (
    <>
      {condition === true ? (
        <div className="text-sm flex justify-center items-center px-2 bg-green-500 rounded-full ">
          <Crown className="h-4 w-4" />
        </div>
      ) : (
        <div className="text-sm flex justify-center items-center px-2 bg-red-500 rounded-full ">
          <Skull className="h-4 w-4" />
        </div>
      )}
    </>
  );
};

export default WinLabel;
