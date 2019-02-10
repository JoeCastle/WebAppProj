import UserDetails from "./userDetails";

export default interface UsersToAddToGroup {
    userDetails: UserDetails[];
    groupID: number;
}
