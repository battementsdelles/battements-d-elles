export const parseExpiresInToSeconds = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/); // e.g. 15m, 2h
  if (!match) throw new Error('Invalid expiresIn format');

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Invalid time unit');
  }
};
