// Your first ten days in China: the trunk the whole app hangs off.
// Each day is a short story of two or three places (ids from scenes.js), played in order.
// into: the line that opens each stop, carrying on from the one before (first stop: how the day starts).
// can: what finishing that place cleanly proves you can do on your own.
window.JOURNEY = {
  days: [
    { title: "Arrive", han: "到了", py: "dào le", stops: [
      { id: "noodles", into: "Day one. Your train from the airport gets in at lunchtime, and you're starving. There's a noodle shop right by the station." },
      { id: "sim", into: "Fed. Your phone has no signal, and nothing here works without one. There's a phone shop across the road." },
      { id: "hotel", into: "Connected at last. Time to drag your suitcase to the hotel." }] },
    { title: "Find your feet", han: "熟悉", py: "shúxi", stops: [
      { id: "directions", into: "You head out to see the city. Then your phone dies." },
      { id: "metro", into: "You found the metro. Now for a ticket, and the right stop." },
      { id: "store", into: "A long day. On the way back to the hotel, the convenience store is still open." }] },
    { title: "Out and about", han: "逛逛", py: "guàngguang", stops: [
      { id: "cafe", into: "A slow start: coffee, and somewhere to get online." },
      { id: "photo", into: "By evening you're on the Bund, and you want a photo to send home." },
      { id: "toilet", into: "Great photo. Now you really need a toilet, and the nearest one is in a mall." }] },
    { title: "Make friends", han: "交朋友", py: "jiāo péngyou", stops: [
      { id: "wechat", into: "Your first Chinese class. The classmate next to you helps you all lesson." },
      { id: "tea", into: "After class you queue for bubble tea, and you're ordering on your own." },
      { id: "friend", into: "You take it to a café near the university to study." }] },
    { title: "Eat like a local", han: "吃货", py: "chīhuò", stops: [
      { id: "dumplings", into: "Lunch on your own at a dumpling house with no English menu." },
      { id: "hotpot", into: "Your classmate texts: hotpot tonight, with two friends." },
      { id: "bill", into: "That was a lot of hotpot. Time to pay, and there are four of you." }] },
    { title: "Market day", han: "赶集", py: "gǎnjí", stops: [
      { id: "fruit", into: "Saturday. The fruit stall on your corner is piled with mandarins." },
      { id: "market", into: "Evening: the night market, and a T-shirt you actually like." }] },
    { title: "Under the weather", han: "不舒服", py: "bù shūfu", stops: [
      { id: "pharmacy", into: "You wake up with a pounding headache. Maybe it was the hotpot." },
      { id: "clinic", into: "By the afternoon your stomach has joined in. Time to see a doctor." },
      { id: "delivery", into: "Home with medicine and no energy. You order food in." }] },
    { title: "Settling in", han: "安顿", py: "āndùn", stops: [
      { id: "landlord", into: "You've moved into a flat. First shower: no hot water." },
      { id: "parcel", into: "The things you ordered for the flat are waiting at the parcel station." },
      { id: "haircut", into: "You're starting to look like a local. Time to get a haircut like one." }] },
    { title: "A bad day", han: "倒霉", py: "dǎoméi", stops: [
      { id: "return", into: "The shirt you bought yesterday is too small. Back to the shop." },
      { id: "lost", into: "Sorted. Then, at the metro gate, you reach for your phone." },
      { id: "bike", into: "Phone reported. You've missed your bus, and it's a long walk home." }] },
    { title: "Moving on", han: "出发", py: "chūfā", stops: [
      { id: "taxi", into: "Ten days in. You're off to Hangzhou, on your own. First, the station." },
      { id: "train", into: "At the station, with no ticket yet." }] }
  ],
  can: {
    hotel: "Check into a hotel", sim: "Get a SIM card", noodles: "Order food the way you want it",
    store: "Shop at a convenience store", directions: "Ask the way and follow it", metro: "Ride the metro",
    cafe: "Order a coffee and get online", photo: "Ask a stranger for help", toilet: "Find a toilet",
    friend: "Introduce yourself", wechat: "Swap contacts", tea: "Order something just how you like it",
    dumplings: "Order by weight and count", hotpot: "Eat out with friends", bill: "Pay and split a bill",
    fruit: "Buy by the jin", market: "Bargain", taxi: "Take a taxi without overpaying",
    pharmacy: "Get medicine", clinic: "See a doctor", delivery: "Get food delivered",
    landlord: "Get something fixed", parcel: "Pick up a parcel", return: "Return or swap something",
    lost: "Report something lost", bike: "Use a share bike", haircut: "Say no to an upsell",
    train: "Buy a train ticket"
  }
};
