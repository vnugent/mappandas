const rules = {
  registered_user: {
    static: [
      "post:create",
      "post:edit",
      "post:delete",
      "users:getSelf",
      "home-page:visit",
      "dashboard-page:visit"
    ],
    dynamic: {
      "post:modify": ({ userId, postOwnerId }) => {
        console.log("#checkOwnership ", userId, postOwnerId);
        if (!userId || !postOwnerId) return false;
        return userId === postOwnerId;
      }
    }
  }
};

const checkOwnership = ({ userId, postOwnerId }) => {
  console.log("#checkOwnership ", userId, postOwnerId);
  if (!userId || !postOwnerId) return false;
  return userId === postOwnerId;
};

export default rules;
