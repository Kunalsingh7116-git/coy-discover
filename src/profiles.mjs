const rows = [
  ["Mira",24,"New Delhi","I plan my Sundays around used bookstores and whichever café has the best cinnamon rolls.","Bookstores","Coffee","Film photography"],
  ["Kabir",26,"Mumbai","Always up for a doubles game. My badminton bag has more snacks than shuttlecocks.","Badminton","Cooking"],
  ["Tara",23,"Bengaluru","Saving a seat at the next indie gig.","Live music","Design"],
  ["Arjun",25,"Pune","Weekend trail runner with a weakness for roadside chai.","Hiking","Tea"],
  ["Ira",24,"Jaipur","Ask me about the pottery class that took over my kitchen.","Pottery","Food"],
  ["Dev",27,"Chandigarh","I make playlists for very specific moods.","Vinyl","Cycling"],
  ["Naina",25,"Mumbai","Currently ranking every dosa place near my apartment.","Food","Travel"],
  ["Rohan",24,"New Delhi","I can teach you chess if you teach me to cook.","Chess","Cooking"],
  ["Sana",23,"Hyderabad","Slow walks, lively debates and an occasional half marathon.","Running","Books"],
  ["Neil",26,"Bengaluru","I photograph streets before the city wakes up.","Photography","Coffee"],
  ["Diya",24,"Pune","I believe every picnic needs a homemade dessert.","Baking","Picnics"],
  ["Aman",25,"Kolkata","Friday evenings are for football and old films.","Football","Cinema"],
  ["Leela",26,"Chennai","Trying to grow enough basil for my first homemade pesto.","Gardening","Cooking"],
  ["Vivaan",23,"Jaipur","Sketching buildings from the nearest tea stall.","Drawing","Architecture"],
  ["Zoya",25,"New Delhi","My favourite travel souvenir is a recipe.","Travel","Cooking"],
  ["Karan",27,"Mumbai","I will absolutely join your pub quiz team.","Trivia","Music"],
  ["Aditi",24,"Chandigarh","Learning the guitar one stubborn chord at a time.","Guitar","Reading"],
  ["Ishaan",26,"Pune","I take board game rules surprisingly seriously.","Board games","Hiking"],
  ["Riya",25,"Bengaluru","On a mission to see a play every month.","Theatre","Writing"],
  ["Sahil",24,"Hyderabad","My best biryani recipe is a family secret.","Cooking","Cricket"],
  ["Meera",27,"Kolkata","Looking for a partner for gallery afternoons.","Art","Museums"],
  ["Aryan",23,"Chennai","Sunrise surfer and reluctant early riser.","Surfing","Coffee"],
  ["Noor",26,"New Delhi","There is always room in my bag for one more book.","Books","Poetry"],
  ["Dhruv",25,"Jaipur","My ideal Saturday starts on a climbing wall.","Climbing","Travel"],
  ["Anvi",24,"Pune","I draw tiny comics about ordinary days.","Comics","Illustration"],
  ["Yash",26,"Mumbai","Finding the city's best sandwich by trial and error.","Food","Cycling"],
  ["Siya",25,"Bengaluru","I know a quiet spot for watching the meteor shower.","Astronomy","Camping"],
  ["Rehan",27,"Kolkata","I collect records and stories from railway journeys.","Vinyl","Travel"],
  ["Avni",23,"Chennai","Happy to swap a dance lesson for a good book recommendation.","Dance","Books"],
  ["Om",25,"Chandigarh","Sunday means a long ride and a late breakfast.","Cycling","Baking"]
];
export const profiles = rows.map(([name, age, city, bio, ...interests], i) => ({
  id:i+1, name, age, city, bio, interests, photo:'/portraits/'+String(i+1).padStart(2,'0')+'.svg'
}));
const incoming = new Set([1,5,8,13,17,22,26,30]);
export function mutual(id, direction) { return direction === 'like' && incoming.has(id); }
export function validSwipe(body) {
  return profiles.some(p=>p.id===body?.profileId) && ['like','pass'].includes(body.direction);
}
