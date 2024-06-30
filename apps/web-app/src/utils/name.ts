export const getInitials = (name?: string) => {
  if (!name) return "";
  const names = name.split(" ");
  const firstName = names[0];
  if (names.length === 1) return firstName?.[0]?.toUpperCase();
  const lastName = names[names.length - 1];
  return `${firstName?.[0]}${lastName?.[0]}`.toUpperCase();
};

export const getFirstLastName = (name?: string) => {
  if (!name) return "";
  const names = name.split(" ");
  const firstName = names[0];
  if (names.length === 1) return firstName;
  const lastName = names[names.length - 1];
  return `${firstName} ${lastName}`;
};
