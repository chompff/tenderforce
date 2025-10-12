import { User } from 'firebase/auth';

/**
 * Gets display information for a user
 * @param user - Firebase User object
 * @returns Object with displayName, initials, and avatar information
 */
export function getUserDisplayInfo(user: User | null) {
  if (!user) {
    return {
      displayName: 'Guest',
      initials: 'G',
      hasPhoto: false,
      photoURL: null,
    };
  }

  // Get display name (from Google) or fall back to email username
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  // Generate initials from display name
  const initials = getInitials(displayName);

  // Check if user has a profile photo (from Google)
  const hasPhoto = !!user.photoURL;

  return {
    displayName,
    initials,
    hasPhoto,
    photoURL: user.photoURL,
  };
}

/**
 * Generates initials from a name
 * @param name - Full name or username
 * @returns 1-2 character initials
 */
function getInitials(name: string): string {
  if (!name) return 'U';

  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    // First and last name: "Roberto van der Linden" -> "RL"
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else {
    // Single name or username: "roberto" -> "R"
    return name.substring(0, 1).toUpperCase();
  }
}
