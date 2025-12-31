import React from 'react';

const EditControls = ({ isEditing, onEditToggle, onSave, saving, user }) => {
  if (!user) return null;

  return (
    <div className="fixed top-24 right-4 z-40 flex gap-2">
      <button
        onClick={onEditToggle}
        className={`px-4 py-2 rounded-lg font-dosis font-semibold transition-colors shadow-lg ${
          isEditing
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : 'bg-reshow-red text-white hover:bg-reshow-dark-red'
        }`}
      >
        {isEditing ? 'Cancel Edit' : 'Edit Page'}
      </button>
      {isEditing && (
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-dosis font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 shadow-lg"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
};

export default EditControls;

