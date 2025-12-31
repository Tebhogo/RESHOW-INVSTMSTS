import React from "react";

const MissionVision = ({ mission, vision, isEditing, onMissionChange, onVisionChange }) => {
  const missionContent = mission || {
    title: "Our Mission",
    content: "To deliver high-quality, innovative, and cost-effective corporate branding and promotional solutions that exceed client expectations through professionalism and reliability."
  };

  const visionContent = vision || {
    title: "Our Vision",
    content: "To be Zimbabwe's leading provider of bespoke corporate branding and promotional products, driven by innovation, excellence, and customer-focused service."
  };

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-0 relative">

        {/* OUR MISSION */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-700 text-white p-12 flex items-center">
          {/* Diagonal Shape */}
          <div className="absolute top-0 right-0 w-24 h-full bg-red-800 transform -skew-x-12 origin-top-right"></div>

          <div className="relative z-10 w-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={missionContent.title}
                  onChange={(e) => onMissionChange && onMissionChange('title', e.target.value)}
                  className="text-3xl font-bold font-dinbek uppercase mb-4 w-full bg-white/20 border-2 border-white rounded px-2 py-1 text-white placeholder-white/70"
                />
                <textarea
                  value={missionContent.content}
                  onChange={(e) => onMissionChange && onMissionChange('content', e.target.value)}
                  className="text-lg font-dosis leading-relaxed w-full bg-white/20 border-2 border-white rounded px-2 py-1 text-white placeholder-white/70"
                  rows="5"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold font-dinbek uppercase mb-4">
                  {missionContent.title}
                </h2>
                <p className="text-lg font-dosis leading-relaxed">
                  {missionContent.content}
                </p>
              </>
            )}
          </div>
        </div>

        {/* OUR VISION */}
        <div
          className="relative bg-cover bg-center flex items-center"
          style={{
            backgroundImage: "url('/images/placeholder/corporate-gifts.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Red Overlay */}
          <div className="absolute inset-0 bg-red-700/80"></div>

          {/* Diagonal Accent */}
          <div className="absolute top-0 left-0 w-24 h-full bg-red-800 transform skew-x-12 origin-top-left"></div>

          <div className="relative z-10 p-12 text-white w-full">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={visionContent.title}
                  onChange={(e) => onVisionChange && onVisionChange('title', e.target.value)}
                  className="text-3xl font-bold font-dinbek uppercase mb-4 w-full bg-white/20 border-2 border-white rounded px-2 py-1 text-white placeholder-white/70"
                />
                <textarea
                  value={visionContent.content}
                  onChange={(e) => onVisionChange && onVisionChange('content', e.target.value)}
                  className="text-lg font-dosis leading-relaxed w-full bg-white/20 border-2 border-white rounded px-2 py-1 text-white placeholder-white/70"
                  rows="5"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold font-dinbek uppercase mb-4">
                  {visionContent.title}
                </h2>
                <p className="text-lg font-dosis leading-relaxed">
                  {visionContent.content}
                </p>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;

