const webPush = require('web-push');

// Generate VAPID keys (run this once and store them securely)
// const vapidKeys = webPush.generateVAPIDKeys();
// console.log(vapidKeys);


// {
//     publicKey: 'BB0ldobS0_bnh5yMIBUrklV8vBscFIEwxwu_gmeRdV8VZS6LPXmOM6N0YPPtQjKP9zeDUNU0mmPZ20nmnPNOy8w',
//     privateKey: 'vdHSZ8LxgSvCNlGDLcKWcgcT_wbyD6xe6FMdQSGQkvA'
//   }


// Configure VAPID keys
const vapidKeys = {
    publicKey: 'BB0ldobS0_bnh5yMIBUrklV8vBscFIEwxwu_gmeRdV8VZS6LPXmOM6N0YPPtQjKP9zeDUNU0mmPZ20nmnPNOy8w',
    privateKey: 'vdHSZ8LxgSvCNlGDLcKWcgcT_wbyD6xe6FMdQSGQkvA',
  };
  
  // Configure web-push
  webPush.setVapidDetails(
    'mailto:godsaveogbidor@gmail.com', // The email to be used as part of the VAPID details
    vapidKeys.publicKey, // The public VAPID key
    vapidKeys.privateKey // The private VAPID key
  );
  
  module.exports = { webPush };