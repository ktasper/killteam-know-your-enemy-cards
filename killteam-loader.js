// Dynamically loads all kill team files from the manifest
(function() {
  const manifest = window.KILLTEAM_FILES || [];
  const allKillteams = [];
  let loadedCount = 0;
  const totalFiles = manifest.length;

  if (totalFiles === 0) {
    console.warn('No kill team files found in manifest');
    window.KILLTEAM_DATA = [];
    window.dispatchEvent(new CustomEvent('killteamsLoaded', { 
      detail: { count: 0 } 
    }));
    return;
  }

  function processKillteamData() {
    // Check if the file exported kill team data
    // Support both single kill team object and array of kill teams
    let killteams = [];
    
    if (window.KILLTEAM_DATA) {
      if (Array.isArray(window.KILLTEAM_DATA)) {
        killteams = window.KILLTEAM_DATA;
      } else {
        // Single kill team object
        killteams = [window.KILLTEAM_DATA];
      }
      // Clear the global to avoid conflicts
      window.KILLTEAM_DATA = null;
    }
    
    return killteams;
  }

  function loadKillteamFile(filePath, index) {
    const script = document.createElement('script');
    script.src = filePath;
    
    script.onload = () => {
      const killteams = processKillteamData();
      allKillteams.push(...killteams);
      loadedCount++;
      
      // When all files are loaded, set the global data and dispatch event
      if (loadedCount === totalFiles) {
        window.KILLTEAM_DATA = allKillteams;
        window.dispatchEvent(new CustomEvent('killteamsLoaded', { 
          detail: { count: allKillteams.length } 
        }));
      }
    };
    
    script.onerror = () => {
      console.warn(`Failed to load kill team file: ${filePath}`);
      loadedCount++;
      
      // Still check if all files are done loading
      if (loadedCount === totalFiles) {
        window.KILLTEAM_DATA = allKillteams;
        window.dispatchEvent(new CustomEvent('killteamsLoaded', { 
          detail: { count: allKillteams.length } 
        }));
      }
    };
    
    document.head.appendChild(script);
  }

  function loadAllKillteams() {
    // Load all files sequentially to avoid conflicts with window.KILLTEAM_DATA
    manifest.forEach((filePath, index) => {
      loadKillteamFile(filePath, index);
    });
  }

  // Start loading when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllKillteams);
  } else {
    loadAllKillteams();
  }
})();

