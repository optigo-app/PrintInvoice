import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { scannedValue } from '../../recoil/atom';

const ScanWithDevice = () => {
    const [scannedValues, setScannedValues] = useState([]);
    const setScanValue = useSetRecoilState(scannedValue);
    useEffect(() => {
        const handleScan = (event) => {
          // Capture scanned data from keyboard events
          if (event.key === 'Enter') {
            // Process scanned value here
            const value = event.target.value.trim();
            if (value) {
                console.log(value);
              setScanValue(value);
              setScannedValues((prev) => [...prev, value]);
              event.target.value = ''; // Clear input after scan
            }
          }
        };
        
        // Attach event listener for scanning
        const inputElement = document.getElementById('scanner-input');
        inputElement.addEventListener('keydown', handleScan);
    
        // Cleanup
        return () => {
          inputElement.removeEventListener('keydown', handleScan);
        };
      }, []);
      console.log(scannedValues);
      
      return (
        <div>
        <img 
          src="path-to-your-image.jpg" 
          alt="Scan" 
          onClick={() => document.getElementById('scanner-input').focus()} 
          style={{ cursor: 'pointer' }}
        />
        <input 
          id="scanner-input"
          style={{ position: 'absolute', left: '-9999px' }} 
          autoFocus 
        />

      </div>
      );
}

export default ScanWithDevice