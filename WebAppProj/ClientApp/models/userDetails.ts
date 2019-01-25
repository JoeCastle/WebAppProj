export default interface UserDetails {
    username?: string; //? allows undefined
    userID: number;
    userRole: string;
    firstname: string;
    surname: string;
    jwt: string;
    groupID: number;
}
