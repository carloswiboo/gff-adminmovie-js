"use client";

export default function VideoQualityInfo({ selectedQuality }) {
  const getQualityDetails = (quality) => {
    const details = {
      'cinema_quality': {
        name: 'Cinema Quality',
        icon: '🎬',
        resolution: 'Original Resolution',
        fps: '24 fps',
        codec: 'H.264 + AAC',
        description: 'Professional cinema standard with 24fps frame rate',
        recommended: 'Film festivals, professional screenings',
        processingTime: '5-15 minutes',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      'source': {
        name: 'Source Quality',
        icon: '📹',
        resolution: 'Original',
        fps: 'Original',
        codec: 'Original',
        description: 'Preserves your original video without any changes',
        recommended: 'Archival purposes, exact quality preservation',
        processingTime: 'Minimal processing',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      'uhd_4k': {
        name: 'Ultra HD 4K',
        icon: '🔥',
        resolution: 'Up to 4K UHD',
        fps: '30 fps',
        codec: 'H.264 + AAC',
        description: 'Maximum quality for large displays',
        recommended: 'Large screens, premium content',
        processingTime: '15-30+ minutes',
        color: 'bg-red-100 text-red-800 border-red-200',
        requiresPro: true
      },
      'fhd_1080p': {
        name: 'Full HD 1080p',
        icon: '📺',
        resolution: '1920x1080',
        fps: '30 fps',
        codec: 'H.264 + AAC',
        description: 'High definition for most online viewing',
        recommended: 'General web distribution, streaming',
        processingTime: '10-20 minutes',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      'hd_720p': {
        name: 'HD 720p',
        icon: '💻',
        resolution: '1280x720',
        fps: '30 fps',
        codec: 'H.264 + AAC',
        description: 'Standard HD quality with balanced file size',
        recommended: 'Web content, faster loading',
        processingTime: '5-15 minutes',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      },
      'web_optimized': {
        name: 'Web Optimized',
        icon: '🌐',
        resolution: 'Adaptive (multiple)',
        fps: 'Variable',
        codec: 'H.264 + AAC',
        description: 'Creates multiple qualities for adaptive streaming',
        recommended: 'Web platforms, diverse audience',
        processingTime: '15-25 minutes',
        color: 'bg-teal-100 text-teal-800 border-teal-200'
      },
      'sd_480p': {
        name: 'SD 480p',
        icon: '📱',
        resolution: '640x480',
        fps: '24 fps',
        codec: 'H.264 + AAC',
        description: 'Mobile-friendly with fast loading',
        recommended: 'Mobile devices, slow connections',
        processingTime: '3-10 minutes',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }
    };
    
    return details[quality] || details['web_optimized'];
  };

  const qualityInfo = getQualityDetails(selectedQuality);

  return (
    <div className={`p-4 rounded-lg border-2 ${qualityInfo.color}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0">
          {qualityInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {qualityInfo.name}
              {qualityInfo.requiresPro && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  Pro+ Required
                </span>
              )}
            </h3>
          </div>
          
          <p className="text-sm mt-1 mb-3">{qualityInfo.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="font-medium">Resolution:</span>
              <br />
              <span>{qualityInfo.resolution}</span>
            </div>
            <div>
              <span className="font-medium">Frame Rate:</span>
              <br />
              <span>{qualityInfo.fps}</span>
            </div>
            <div>
              <span className="font-medium">Codec:</span>
              <br />
              <span>{qualityInfo.codec}</span>
            </div>
            <div>
              <span className="font-medium">Processing:</span>
              <br />
              <span>{qualityInfo.processingTime}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
            <span className="font-medium text-xs">Best for:</span>
            <br />
            <span className="text-sm">{qualityInfo.recommended}</span>
          </div>
        </div>
      </div>
    </div>
  );
}