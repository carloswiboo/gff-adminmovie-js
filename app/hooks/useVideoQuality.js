"use client";
import { useState, useCallback } from 'react';

export const VIDEO_QUALITY_OPTIONS = [
  {
    value: 'cinema_quality',
    label: '🎬 Cinema Quality (24fps H.264 - Recommended for festivals)',
    description: 'Perfect for film festivals - maintains professional quality with 24fps cinematic standard.',
    isDefault: true,
    isPro: false
  },
  {
    value: 'source',
    label: '📹 Source Quality (Original file quality)',
    description: 'Preserves your original video quality without any compression.',
    isDefault: false,
    isPro: false
  },
  {
    value: 'uhd_4k',
    label: '🔥 Ultra HD 4K (Requires Pro+ plan)',
    description: 'Ultra high definition - requires Vimeo Pro or higher plan.',
    isDefault: false,
    isPro: true
  },
  {
    value: 'fhd_1080p',
    label: '📺 Full HD 1080p (30fps)',
    description: 'High definition suitable for most online viewing.',
    isDefault: false,
    isPro: false
  },
  {
    value: 'hd_720p',
    label: '💻 HD 720p (Standard)',
    description: 'Standard HD quality, good balance between quality and file size.',
    isDefault: false,
    isPro: false
  },
  {
    value: 'web_optimized',
    label: '🌐 Web Optimized (Adaptive streaming)',
    description: 'Automatically adjusts quality based on viewer\'s connection.',
    isDefault: false,
    isPro: false
  },
  {
    value: 'sd_480p',
    label: '📱 SD 480p (Mobile friendly)',
    description: 'Lower quality but faster loading, ideal for mobile devices.',
    isDefault: false,
    isPro: false
  }
];

export function useVideoQuality(initialQuality = 'cinema_quality') {
  const [selectedQuality, setSelectedQuality] = useState(initialQuality);

  const getQualityOption = useCallback((quality) => {
    return VIDEO_QUALITY_OPTIONS.find(option => option.value === quality) || VIDEO_QUALITY_OPTIONS[0];
  }, []);

  const getQualityConfig = useCallback((quality) => {
    const configs = {
      'source': {
        transcode: {
          quality: 'source'
        }
      },
      'uhd_4k': {
        transcode: {
          quality: 'source',
          video_codec: 'h264',
          audio_codec: 'aac'
        }
      },
      'fhd_1080p': {
        transcode: {
          quality: 'hd',
          video_codec: 'h264',
          audio_codec: 'aac',
          fps: 30
        }
      },
      'hd_720p': {
        transcode: {
          quality: 'sd',
          video_codec: 'h264',
          audio_codec: 'aac',
          fps: 30
        }
      },
      'sd_480p': {
        transcode: {
          quality: 'mobile',
          video_codec: 'h264',
          audio_codec: 'aac',
          fps: 24
        }
      },
      'web_optimized': {
        transcode: {
          quality: 'adaptive',
          video_codec: 'h264',
          audio_codec: 'aac'
        }
      },
      'cinema_quality': {
        transcode: {
          quality: 'source',
          video_codec: 'h264',
          audio_codec: 'aac',
          fps: 24
        }
      },
      'adaptive': {
        transcode: {
          quality: 'adaptive'
        }
      }
    };
    
    return configs[quality] || configs['adaptive'];
  }, []);

  const isProRequired = useCallback((quality) => {
    const option = getQualityOption(quality);
    return option?.isPro || false;
  }, [getQualityOption]);

  const getEstimatedProcessingTime = useCallback((quality, fileSizeGB) => {
    const baseTimes = {
      'source': 0.5,
      'cinema_quality': 1,
      'uhd_4k': 3,
      'fhd_1080p': 2,
      'hd_720p': 1.5,
      'web_optimized': 2.5,
      'sd_480p': 1
    };
    
    const baseTime = baseTimes[quality] || 1;
    const estimatedMinutes = Math.round(baseTime * fileSizeGB * 5);
    
    return estimatedMinutes > 0 ? `${estimatedMinutes}-${Math.round(estimatedMinutes * 1.5)} minutes` : '1-3 minutes';
  }, []);

  return {
    selectedQuality,
    setSelectedQuality,
    qualityOptions: VIDEO_QUALITY_OPTIONS,
    getQualityOption,
    getQualityConfig,
    isProRequired,
    getEstimatedProcessingTime
  };
}