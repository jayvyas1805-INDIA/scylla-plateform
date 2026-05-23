import React from 'react';

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  Disabled: 'bg-red-100 text-red-700',
};

const CategoryTile = ({ title, description, count, countLabel, status, onEdit, onDelete }) => (
  <div className="bg-white/95 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-start justify-between">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <span className={`text-xs px-2 py-1 rounded ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    </div>

    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>

    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {countLabel || `${count} Vendors`}
      </span>
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          aria-label="Edit"
          className="text-blue-600 hover:text-blue-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete"
          className="text-red-600 hover:text-red-700 text-sm focus:outline-none focus:ring-1 focus:ring-red-400 rounded"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
);

export default CategoryTile;
