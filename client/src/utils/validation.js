export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
  return passwordRegex.test(password);
};

export const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

export const validateAddress = (address) => {
  return address && address.length <= 400;
};

export const validateRating = (rating) => {
  const numRating = parseInt(rating);
  return numRating >= 1 && numRating <= 5;
};
