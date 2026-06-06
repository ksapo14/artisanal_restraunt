async function run() {
  const buckets = [
    "artisanal-restraunt.appspot.com",
    "artisanal-restraunt.firebasestorage.app",
    "artisanal-restaurant.appspot.com",
    "artisanal-restaurant.firebasestorage.app"
  ];
  for (const bucket of buckets) {
    try {
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o`;
      const res = await fetch(url);
      console.log(`Bucket: ${bucket}, Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (e) {
      console.error(`Bucket: ${bucket} failed:`, e);
    }
  }
}
run();
