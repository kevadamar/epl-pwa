const webPush = require("web-push");

const vapidKeys = {
    "publicKey": "BB_0LZz2k40SF2zqL-UMbVpmjiLp_QWe4UHhbG4I6YyfuOwwnK83Dx4BYMxBdqwRCzq7IyYz97h2njb-HwKPaRA",
    "privateKey": "BOg1Ey00anCfpnJaBs16mjt0iu8swz9nV8ja3vW7MZ4"
};

webPush.setVapidDetails(
    "email: kevadamarg@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/ft44Pg229zY:APA91bHut4DjFHNRc5AeLsPH5wczbVKwm0Jshmj5Khj2N30G-TX0TtgcT-zi36ELmNuj8sxeh8uZ5JXreAdrAnEaC_YU0aD4cbD7nIp_SqOzwbozJWUOoCxHH6dP7OycotawYC25B-ZJ",
    "keys": {
        "p256dh": "BJjXcFgVUHUqH/Qjszq3hmBmWdFILJuhmsLBTEpOX3FyxAeFwymOT6gnbH1X9FjgQQqk0b6dt9N8ZIi5FzOWUjE=",
        "auth": "vtyRZtTRw8tc5H+ZS22/fA=="
    }
};

const payLoad = "Selamat! Aplikasi Anda sudah dapat menerima notifikasi!";

const options = {
    gcmAPIKey: "947400191005",
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payLoad,
    options
);