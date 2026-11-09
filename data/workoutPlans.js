/**
 * workoutPlans.js – curated workout plans, sessions and exercises
 * All data is static/hardcoded; progress is stored in memory keyed by userId.
 */

// ── Static workout plan catalogue ──────────────────────────────
const PLANS = [
  {
    id: 'beginner-full-body',
    title: 'Beginner Full Body',
    level: 'Beginner',
    goal: 'General Fitness',
    duration: '4 Weeks',
    daysPerWeek: 3,
    emoji: '🔰',
    color: '#2563eb',
    description: 'Perfect starting point. 3 days a week, no equipment needed.',
    sessions: [
      {
        id: 's1', day: 'Day 1', title: 'Upper Body Basics',
        exercises: [
          { id: 'e1', name: 'Push-Ups',        sets: 3, reps: '10', rest: '60s', muscle: 'Chest/Triceps', tip: 'Keep body straight, lower chest to floor.' },
          { id: 'e2', name: 'Chair Dips',       sets: 3, reps: '12', rest: '60s', muscle: 'Triceps',       tip: 'Keep elbows close to body.' },
          { id: 'e3', name: 'Plank',            sets: 3, reps: '30s', rest: '45s', muscle: 'Core',         tip: 'Engage your core, keep hips level.' },
          { id: 'e4', name: 'Shoulder Taps',   sets: 3, reps: '20', rest: '45s', muscle: 'Shoulders/Core', tip: 'Minimise hip rotation.' },
        ],
      },
      {
        id: 's2', day: 'Day 2', title: 'Lower Body Foundations',
        exercises: [
          { id: 'e5', name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s', muscle: 'Quads/Glutes', tip: 'Push knees out, weight on heels.' },
          { id: 'e6', name: 'Glute Bridges',     sets: 3, reps: '15', rest: '45s', muscle: 'Glutes/Hamstrings', tip: 'Squeeze at the top.' },
          { id: 'e7', name: 'Reverse Lunges',    sets: 3, reps: '10 each', rest: '60s', muscle: 'Quads/Glutes', tip: 'Keep front knee over ankle.' },
          { id: 'e8', name: 'Calf Raises',       sets: 3, reps: '20', rest: '30s', muscle: 'Calves',      tip: 'Slow and controlled movement.' },
        ],
      },
      {
        id: 's3', day: 'Day 3', title: 'Core & Cardio',
        exercises: [
          { id: 'e9',  name: 'Jumping Jacks',    sets: 3, reps: '30', rest: '30s', muscle: 'Full Body',   tip: 'Keep a steady rhythm.' },
          { id: 'e10', name: 'Mountain Climbers', sets: 3, reps: '20', rest: '45s', muscle: 'Core/Cardio', tip: 'Drive knees towards chest alternately.' },
          { id: 'e11', name: 'Bicycle Crunches',  sets: 3, reps: '20', rest: '45s', muscle: 'Core',       tip: 'Elbow to opposite knee.' },
          { id: 'e12', name: 'Burpees',           sets: 3, reps: '8',  rest: '60s', muscle: 'Full Body',  tip: 'Explode up from the squat position.' },
        ],
      },
    ],
  },
  {
    id: 'fat-loss-hiit',
    title: 'Fat Loss HIIT',
    level: 'Intermediate',
    goal: 'Weight Loss',
    duration: '6 Weeks',
    daysPerWeek: 4,
    emoji: '🔥',
    color: '#ea580c',
    description: 'High intensity intervals to maximise calorie burn at home.',
    sessions: [
      {
        id: 's4', day: 'Day 1', title: 'Cardio Blast',
        exercises: [
          { id: 'e13', name: 'High Knees',       sets: 4, reps: '45s', rest: '15s', muscle: 'Cardio',     tip: 'Pump arms for full intensity.' },
          { id: 'e14', name: 'Burpees',          sets: 4, reps: '10',  rest: '20s', muscle: 'Full Body',  tip: 'Move fast, minimal rest.' },
          { id: 'e15', name: 'Jump Squats',      sets: 4, reps: '12',  rest: '20s', muscle: 'Quads/Glutes', tip: 'Land softly to protect knees.' },
          { id: 'e16', name: 'Speed Skaters',    sets: 4, reps: '20',  rest: '15s', muscle: 'Legs/Cardio', tip: 'Leap side to side with control.' },
        ],
      },
      {
        id: 's5', day: 'Day 2', title: 'Core Meltdown',
        exercises: [
          { id: 'e17', name: 'Plank Hold',         sets: 4, reps: '45s', rest: '15s', muscle: 'Core',    tip: 'Squeeze glutes and abs.' },
          { id: 'e18', name: 'Russian Twists',     sets: 4, reps: '20',  rest: '20s', muscle: 'Obliques', tip: 'Feet off ground for extra challenge.' },
          { id: 'e19', name: 'Leg Raises',         sets: 4, reps: '15',  rest: '20s', muscle: 'Lower Abs', tip: 'Keep lower back pressed to floor.' },
          { id: 'e20', name: 'Flutter Kicks',      sets: 4, reps: '30s', rest: '15s', muscle: 'Core',    tip: 'Small, quick kicks.' },
        ],
      },
      {
        id: 's6', day: 'Day 3', title: 'Lower Body Burn',
        exercises: [
          { id: 'e21', name: 'Sumo Squats',        sets: 4, reps: '15',  rest: '30s', muscle: 'Inner Thighs/Glutes', tip: 'Wide stance, toes out at 45°.' },
          { id: 'e22', name: 'Donkey Kicks',       sets: 3, reps: '15 each', rest: '20s', muscle: 'Glutes', tip: 'Squeeze at the top of the movement.' },
          { id: 'e23', name: 'Side Leg Raises',    sets: 3, reps: '20 each', rest: '15s', muscle: 'Hip Abductors', tip: 'Keep hips stacked.' },
          { id: 'e24', name: 'Wall Sit',           sets: 3, reps: '45s', rest: '30s', muscle: 'Quads',  tip: 'Thighs parallel to floor.' },
        ],
      },
      {
        id: 's7', day: 'Day 4', title: 'Full Body HIIT',
        exercises: [
          { id: 'e25', name: 'Squat to Press',     sets: 4, reps: '12',  rest: '20s', muscle: 'Full Body', tip: 'Use light dumbbells if available.' },
          { id: 'e26', name: 'Push-Up to Rotation', sets: 4, reps: '10', rest: '20s', muscle: 'Chest/Core', tip: 'Rotate fully, extend arm to sky.' },
          { id: 'e27', name: 'Lunge Jumps',        sets: 4, reps: '10 each', rest: '30s', muscle: 'Legs', tip: 'Switch legs in mid-air.' },
          { id: 'e28', name: 'Star Jumps',         sets: 4, reps: '15',  rest: '20s', muscle: 'Cardio/Full Body', tip: 'Full arm and leg extension.' },
        ],
      },
    ],
  },
  {
    id: 'muscle-builder',
    title: 'Home Muscle Builder',
    level: 'Intermediate',
    goal: 'Muscle Gain',
    duration: '8 Weeks',
    daysPerWeek: 5,
    emoji: '💪',
    color: '#16a34a',
    description: 'Build strength and muscle with progressive bodyweight exercises.',
    sessions: [
      {
        id: 's8', day: 'Day 1', title: 'Chest & Triceps',
        exercises: [
          { id: 'e29', name: 'Wide Push-Ups',       sets: 4, reps: '15',  rest: '60s', muscle: 'Chest',    tip: 'Hands wider than shoulders.' },
          { id: 'e30', name: 'Diamond Push-Ups',    sets: 3, reps: '10',  rest: '60s', muscle: 'Triceps',  tip: 'Hands form a diamond shape.' },
          { id: 'e31', name: 'Decline Push-Ups',    sets: 3, reps: '12',  rest: '60s', muscle: 'Upper Chest', tip: 'Feet on chair/sofa.' },
          { id: 'e32', name: 'Tricep Dips',         sets: 3, reps: '12',  rest: '45s', muscle: 'Triceps',  tip: 'Keep back close to surface.' },
        ],
      },
      {
        id: 's9', day: 'Day 2', title: 'Back & Biceps',
        exercises: [
          { id: 'e33', name: 'Superman Hold',       sets: 4, reps: '15',  rest: '45s', muscle: 'Lower Back', tip: 'Squeeze shoulder blades together.' },
          { id: 'e34', name: 'Towel Rows',          sets: 4, reps: '12',  rest: '60s', muscle: 'Back/Biceps', tip: 'Use a sturdy towel around a door.' },
          { id: 'e35', name: 'Reverse Snow Angels', sets: 3, reps: '15',  rest: '45s', muscle: 'Upper Back', tip: 'Lie face down, arms sweep wide.' },
          { id: 'e36', name: 'Bicep Curls (bottle)', sets: 3, reps: '15', rest: '45s', muscle: 'Biceps',   tip: 'Use water bottles as weights.' },
        ],
      },
      {
        id: 's10', day: 'Day 3', title: 'Legs & Glutes',
        exercises: [
          { id: 'e37', name: 'Bulgarian Split Squat', sets: 4, reps: '12 each', rest: '60s', muscle: 'Quads/Glutes', tip: 'Rear foot elevated on chair.' },
          { id: 'e38', name: 'Single Leg Deadlift',   sets: 3, reps: '10 each', rest: '60s', muscle: 'Hamstrings/Balance', tip: 'Keep a slight knee bend.' },
          { id: 'e39', name: 'Hip Thrusts',           sets: 4, reps: '15',  rest: '45s', muscle: 'Glutes',    tip: 'Upper back on sofa for elevation.' },
          { id: 'e40', name: 'Jump Lunges',           sets: 3, reps: '10 each', rest: '60s', muscle: 'Legs', tip: 'Drive off front foot explosively.' },
        ],
      },
    ],
  },
  {
    id: 'yoga-flexibility',
    title: 'Yoga & Flexibility',
    level: 'All Levels',
    goal: 'Flexibility & Wellness',
    duration: '4 Weeks',
    daysPerWeek: 5,
    emoji: '🧘',
    color: '#7c3aed',
    description: 'Improve flexibility, reduce stress, and build mindfulness.',
    sessions: [
      {
        id: 's11', day: 'Day 1', title: 'Morning Flow',
        exercises: [
          { id: 'e41', name: 'Cat-Cow Stretch',   sets: 1, reps: '10 cycles', rest: '0', muscle: 'Spine',   tip: 'Breathe in on cow, out on cat.' },
          { id: 'e42', name: 'Downward Dog',       sets: 1, reps: '45s hold', rest: '15s', muscle: 'Hamstrings/Shoulders', tip: 'Push heels toward floor.' },
          { id: 'e43', name: 'Warrior I',          sets: 1, reps: '30s each side', rest: '15s', muscle: 'Hip Flexors', tip: 'Front knee over ankle.' },
          { id: 'e44', name: "Child's Pose",       sets: 1, reps: '60s hold', rest: '0',  muscle: 'Back/Hips', tip: 'Breathe deeply into the stretch.' },
        ],
      },
      {
        id: 's12', day: 'Day 2', title: 'Hip & Hamstring Release',
        exercises: [
          { id: 'e45', name: 'Pigeon Pose',        sets: 1, reps: '60s each', rest: '15s', muscle: 'Hip Flexors', tip: 'Fold forward for deeper stretch.' },
          { id: 'e46', name: 'Standing Forward Fold', sets: 1, reps: '45s', rest: '0',  muscle: 'Hamstrings', tip: 'Bend knees slightly if tight.' },
          { id: 'e47', name: 'Seated Twist',       sets: 1, reps: '30s each side', rest: '15s', muscle: 'Spine/Obliques', tip: 'Sit tall before twisting.' },
          { id: 'e48', name: 'Happy Baby Pose',    sets: 1, reps: '60s',   rest: '0',  muscle: 'Hips/Groin', tip: 'Rock gently side to side.' },
        ],
      },
    ],
  },
  {
    id: '30-day-cardio',
    title: '30-Day Cardio Challenge',
    level: 'Beginner–Intermediate',
    goal: 'Endurance & Weight Loss',
    duration: '30 Days',
    daysPerWeek: 6,
    emoji: '🏃',
    color: '#0891b2',
    description: 'Daily cardio sessions that progressively get more challenging.',
    sessions: [
      {
        id: 's13', day: 'Week 1 – Day 1', title: 'Cardio Starter',
        exercises: [
          { id: 'e49', name: 'Marching in Place', sets: 1, reps: '3 min', rest: '60s', muscle: 'Cardio',    tip: 'Lift knees to hip height.' },
          { id: 'e50', name: 'Step Touches',      sets: 2, reps: '2 min', rest: '30s', muscle: 'Cardio/Legs', tip: 'Keep arms moving.' },
          { id: 'e51', name: 'Jumping Jacks',     sets: 2, reps: '30',   rest: '30s', muscle: 'Full Body',  tip: 'Keep a steady rhythm.' },
        ],
      },
      {
        id: 's14', day: 'Week 2 – Day 1', title: 'Cardio Step Up',
        exercises: [
          { id: 'e52', name: 'Jogging in Place',  sets: 1, reps: '5 min', rest: '60s', muscle: 'Cardio',    tip: 'Land on balls of feet.' },
          { id: 'e53', name: 'High Knees',        sets: 3, reps: '45s',  rest: '15s', muscle: 'Cardio/Legs', tip: 'Pump arms aggressively.' },
          { id: 'e54', name: 'Burpees',           sets: 3, reps: '8',   rest: '30s', muscle: 'Full Body',  tip: 'Focus on form first, then speed.' },
        ],
      },
    ],
  },
];

// ── In-memory progress store ────────────────────────────────────
// { [userId]: { [planId]: { startedAt, completedSessions: Set, exerciseLogs: [...] } } }
const progressStore = new Map();

function getProgress(userId) {
  if (!progressStore.has(userId)) progressStore.set(userId, {});
  return progressStore.get(userId);
}

module.exports = { PLANS, getProgress };
