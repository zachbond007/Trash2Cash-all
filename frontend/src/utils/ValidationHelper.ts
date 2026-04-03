export const validateEmail = (email: string) => {
  const regExpEmail = /^[\w-\.-\+]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return !(email.length > 0 && !email.match(regExpEmail));
};
