export const activityTypes = ["Volunteering", "Workshop", "Training"];

export const skills = [
	"art & craft",
	"befriending",
	"coaching & mentoring",
	"counselling",
	"dialect-speaking",
	"emcee skills",
	"entrepreuneurship",
	"event management",
	"facilitation",
	"first-aid",
	"graphic design",
	"language translation",
	"light design",
	"music",
	"photography",
	"public relations",
	"reading",
	"sign language",
	"social media execution",
	"software development",
	"sound engineering",
	"sports",
	"sports coach",
	"stage management",
	"story-telling",
	"team building",
	"tour guiding",
	"tutoring",
	"ushering",
	"videography",
	"advertising & marketing",
	"tour guiding",
];

export const interests = [
	"animal welfare",
	"children & youth",
	"eldercare",
	"migrant workers",
	"conservation & nature",
	"drug awareness",
	"education",
	"families",
	"environment & water",
	"health",
	"mental health",
	"special needs",
	"persons with disability",
	"women & girls",
];

export const languages = [
	"english",
	"mandarin",
	"malay",
	"tamil",
	"others",
];

export const capitalise = (input) => {
	return input
		.split(" ")
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");
};
