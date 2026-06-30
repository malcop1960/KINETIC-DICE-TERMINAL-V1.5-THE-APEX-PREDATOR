/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export type DeviceMode = 'mobile-portrait' | 'mobile-landscape' | 'laptop' | 'desktop';

export function useDeviceMode(): DeviceMode {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;

      // Classify viewports dynamically based on standard modern responsive breakpoints
      if (width < 640 && isPortrait) {
        setDeviceMode('mobile-portrait');
      } else if (height < 520 && width >= 480 && !isPortrait) {
        // Broadly covers smartphones turned on their side
        setDeviceMode('mobile-landscape');
      } else if (width < 1024) {
        // Tablet or small screen portrait is grouped under mobile portrait/landscape based on layout ratios
        if (isPortrait) {
          setDeviceMode('mobile-portrait');
        } else {
          setDeviceMode('mobile-landscape');
        }
      } else if (width >= 1024 && width < 1440) {
        setDeviceMode('laptop');
      } else {
        setDeviceMode('desktop');
      }
    };

    // Calculate initial mode
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceMode;
}
