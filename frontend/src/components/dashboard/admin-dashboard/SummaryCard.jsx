import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl ${color} text-white flex items-center justify-between`}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-right">
        <h5 className="text-xl font-semibold">{text}</h5>
        <p className="text-3xl font-extrabold">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
