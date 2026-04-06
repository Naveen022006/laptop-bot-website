# Wake Lock Feature - Documentation

## Overview
The website now includes a **Screen Wake Lock** feature to prevent the device/laptop from going to sleep while the website is open.

## How It Works

### 1. **Automatic Activation**
- The website automatically requests screen wake lock when the page loads
- Emoji indicator in navbar: 🌟 = Active, 😴 = Inactive

### 2. **Screen Wake Lock API**
- Uses the modern **Screen Wake Lock API** (supported in Chrome, Edge, Firefox, Safari)
- Prevents the screen from dimming or going to sleep
- Works on phones, tablets, and desktops

### 3. **Fallback Method**
- For older browsers that don't support Wake Lock API
- Sends periodic "keep-alive" XHR requests every 5 minutes
- Maintains connection and prevents idle timeout

### 4. **User Control**
- Click the wake lock button (🌟 when active) in the navbar to toggle on/off
- Visual feedback shows current status
- Persists across navigation within the site

## Features

✅ **Web Standard API**: Uses official Screen Wake Lock API
✅ **Auto-Reacquire**: Regains wake lock if page becomes visible again
✅ **Fallback Support**: Works on older browsers with keep-alive method
✅ **User Friendly**: Easy toggle button in navigation bar
✅ **Console Logging**: Detailed logs of wake lock activity
✅ **No Performance Impact**: Minimal resource usage

## Browser Support

| Browser | Support | Method |
|---------|---------|--------|
| Chrome 84+ | ✅ Full | Wake Lock API |
| Edge 84+ | ✅ Full | Wake Lock API |
| Firefox 68+ | ✅ Partial | Fallback |
| Safari 15.4+ | ✅ Full | Wake Lock API |
| Mobile Chrome | ✅ Full | Wake Lock API |
| Mobile Safari | ✅ Full | Wake Lock API |

## Implementation Details

### JavaScript Functions

```javascript
// Request screen wake lock
requestWakeLock() - Activates screen wake lock

// Release wake lock
releaseWakeLock() - Deactivates screen wake lock

// Keep page active
keepPageActive() - Fallback keep-alive method (every 5 minutes)

// Setup button functionality
setupWakeLockButton() - Handles UI button interactions
```

### Button Behavior

- **Disabled (😴)**: Screen can sleep
  - Click to activate wake lock
  
- **Active (🌟)**: Screen won't sleep
  - Click to deactivate wake lock
  - Shows ambient glow effect

## Console Messages

When you open browser DevTools (F12), you'll see:

```
✅ Screen Wake Lock activated - Device will not sleep
🔄 Keep-alive activity triggered (every 5 minutes)
⚠️ Wake Lock released (when toggled off)
🔄 Page hidden - Wake lock may be released
```

## Use Cases

- **Streaming Sessions**: Keep laptop awake during stream previews
- **Monitoring Dashboard**: Display system status continuously
- **Testing Sessions**: Keep screen on while testing bot commands
- **Presentations**: Screen won't sleep during slides
- **Remote Viewing**: Laptop stays awake for remote sessions

## Technical Notes

### Wake Lock Requirements
- Only works in HTTPS (or localhost for development)
- Requires user interaction (click) first in some browsers
- Reduces power consumption compared to older methods
- Browser can still close tab/window normally

### Security & Privacy
- No data collected or transmitted
- User must actively enable (auto-activates but can be disabled)
- Only prevents screen sleep, doesn't prevent shutdown
- Respects browser's normal operation

## Troubleshooting

### Wake Lock Not Working?
1. Check browser console (F12) for errors
2. Ensure site is accessed via HTTPS
3. Try clicking the button to toggle it on
4. Check if browser supports Wake Lock API

### Fallback Not Working?
1. Check network connection (keep-alive needs internet)
2. Some corporate firewalls may block periodic requests
3. Try refreshing the page and clicking wake lock button

### Button Not Appearing?
1. Clear browser cache
2. Hard refresh page (Ctrl+Shift+R)
3. Check browser console for JavaScript errors

## Files Modified

- `js/script.js` - Added wake lock logic
- `css/styles.css` - Added button styles (main page)
- `css/pages.css` - Added button styles (sub-pages)
- `index.html` - Added button to navbar
- `pages/features.html` - Added button to navbar
- `pages/setup.html` - Added button to navbar
- `pages/contact.html` - Added button to navbar

## Future Enhancements

- User preference storage (remember active state between sessions)
- Status indicator with remaining battery info
- Brightness control alongside wake lock
- Integration with actual bot status indicator
