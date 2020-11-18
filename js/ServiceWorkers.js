if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(function(){
                console.log("Register serviceWorker is Success");
            }).catch(function(){
                console.log("Register ServiceWorker is failed");
            });
    });
} else {
    console.log("Your Browser not support ServiceWorker");
}

//==================================================================================================================
// for push notif

//function untuk mengubah string manjadi Uint8array
const urlbase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++){
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Fitur Notification
const RequestNotification = () => {
    Notification.requestPermission().then(result => {
        if (result === "denied"){
            console.error("Fitur Notification tidak di izinkan");
            return;
        } else if (result === "default"){
            console.error("User Closed kotak dialog permintaan izin");
            return;
        }
        if ("PushManager" in window){
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlbase64ToUint8Array("BB_0LZz2k40SF2zqL-UMbVpmjiLp_QWe4UHhbG4I6YyfuOwwnK83Dx4BYMxBdqwRCzq7IyYz97h2njb-HwKPaRA"),
                }).then(subscribe => {
                    console.log("Berhasil subscribe dengan endPoint: ", subscribe.endpoint);
                    console.log("Berhasil subscribe dengan p256dh key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))));
                    console.log("Berhasil subscribe dengan auth key: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
                }).catch(err => {
                    console.error("Tidak Dapat subscribe: ", err.message);
                })
            })
        }
    });
}

if (!("Notification" in window)){
    console.error("Your browser Not support Fitur Notification");
} else {
    RequestNotification();
}