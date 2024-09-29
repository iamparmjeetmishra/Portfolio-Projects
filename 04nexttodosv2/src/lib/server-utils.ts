// I want to a function that check the user is authenticated or note
// if the user is authenticated then I will return the user object
// if the user is not authenticated then I will return null or undefined
// I will also check if the user is authenticated in the store
// if the user is authenticated in the store then I will return the user object
// through token

export const isUserAuthenticated = () => {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("nexttodotoken");
  }
  if (!token) {
    return;
  } else {
    return token;
  }
};
