import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
    </div>
  );
};

export default Spinner;
