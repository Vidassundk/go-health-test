export const english = {
  common: {
    next: "Next",
    submit: "Submit",
    placeholders: {
      email: "Email",
      password: "Password",
      genericAnswer: "Your answer",
    },
  },
  apiErrors: {
    quizApiNotConfigured:
      "Quiz API is not configured. Add EXPO_PUBLIC_QUIZ_API_URL to your .env file.",
    quizApiNetwork:
      "Unable to reach Quiz API. Check your internet connection and try again.",
    quizApiRequestFailed:
      "Unable to load quiz questions right now. Please try again in a moment.",
    quizApiInvalidResponse:
      "Received an invalid response from Quiz API. Please try again later.",
  },
  home: {
    greeting: "First & foremost, congratulations on this first step.",
    subtext: "Be ready to amaze yourself.",
  },
  homeScreen: {
    title: "Your journey is about to begin...",
    text: "We're preparing something special for you. In the meantime, you're on the waitlist.",
    startOver: "Start over",
  },
  summary: {
    labels: {
      sectionTitle: "Summary",
      welcomePrefix: "Welcome to your new journey, ",
      yourGoal: "Your goal",
      complementaryGoal: "Complementary goal:",
      complementaryGoals: "Complementary goals:",
      startJourney: "Start my journey",
    },
  },
} as const;
