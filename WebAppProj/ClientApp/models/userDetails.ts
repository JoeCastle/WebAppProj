export default interface UserDetails {
    username?: string; //? allows undefined
    userID: string;
    userRole: string;
    firstname: string;
    surname: string;
    jwt: string;
}
